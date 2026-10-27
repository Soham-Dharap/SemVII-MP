import React from "react";

interface ContributionHeatmapProps {
  /** ISO date string (yyyy-mm-dd) -> number of edits that day. */
  activity: Record<string, number>;
}

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LEVEL_CLASSES = [
  "bg-border",
  "bg-iris/25",
  "bg-iris/50",
  "bg-iris/75",
  "bg-iris",
];

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function intensity(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * GitHub-style 53-week contribution graph, rendered as pure CSS grid.
 * Columns are weeks (Sunday first), rows are the seven weekdays.
 */
export default function ContributionHeatmap({
  activity,
}: ContributionHeatmapProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 52 * 7);
  start.setDate(start.getDate() - start.getDay()); // align to Sunday

  const weeks: Array<Array<{ date: Date; count: number; key: string }>> = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    const week: Array<{ date: Date; count: number; key: string }> = [];
    for (let day = 0; day < 7; day += 1) {
      const key = toDayKey(cursor);
      week.push({
        date: new Date(cursor),
        count: activity[key] ?? 0,
        key,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  const total = Object.values(activity).reduce((sum, n) => sum + n, 0);
  const activeDays = Object.values(activity).filter((n) => n > 0).length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {total} contribution{total === 1 ? "" : "s"} in the last year
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {activeDays} active day{activeDays === 1 ? "" : "s"} · every saved
            file edit counts
          </p>
        </div>
      </div>

      <div className="overflow-x-auto editor-scroll pb-1">
        <div className="min-w-[720px]">
          {/* Month labels */}
          <div className="mb-1.5 flex gap-[3px] pl-8">
            {weeks.map((week, weekIndex) => {
              const first = week[0].date;
              const prev = weekIndex > 0 ? weeks[weekIndex - 1][0].date : null;
              const showMonth =
                !prev || prev.getMonth() !== first.getMonth();
              return (
                <div
                  key={`m-${weekIndex}`}
                  className="w-[11px] text-[10px] font-medium text-muted-foreground"
                >
                  {showMonth ? MONTH_LABELS[first.getMonth()] : ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            {/* Weekday labels */}
            <div className="mr-1 flex flex-col gap-[3px]">
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="flex h-[11px] items-center text-[9px] font-medium text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map(({ date, count, key }) => (
                  <div
                    key={key}
                    title={`${count} edit${count === 1 ? "" : "s"} on ${date.toDateString()}`}
                    className={`size-[11px] rounded-[3px] transition-transform duration-150 hover:scale-125 ${LEVEL_CLASSES[intensity(count)]}`}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
            Less
            {LEVEL_CLASSES.map((cls, i) => (
              <span
                key={i}
                className={`size-[11px] rounded-[3px] ${cls}`}
              />
            ))}
            More
          </div>
        </div>
      </div>
    </div>
  );
}
