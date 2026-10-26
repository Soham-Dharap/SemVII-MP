import { cn } from "@/lib/utils";

function CodeLine({
  tokens,
  width = "w-full",
}: {
  tokens: { text: string; tone?: string }[];
  width?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 shrink-0 text-right font-mono text-[10px] text-zinc-300">
        ·
      </span>
      <div className={cn("flex h-3 items-center gap-1.5", width)}>
        {tokens.map((token, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 rounded-[3px]",
              token.tone ?? "bg-zinc-200",
            )}
            style={{ width: token.text }}
          />
        ))}
      </div>
    </div>
  );
}

const TREE = [
  { name: "src", depth: 0, folder: true, open: true },
  { name: "App.jsx", depth: 1, active: true },
  { name: "main.jsx", depth: 1 },
  { name: "styles.css", depth: 1 },
  { name: "index.html", depth: 0 },
  { name: "package.json", depth: 0 },
];

export default function EditorMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-2xl shadow-zinc-900/10 ring-1 ring-black/[0.02]">
      {/* Browser chrome */}
      <div className="flex h-11 items-center gap-3 border-b border-zinc-100 bg-zinc-50/80 px-4">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-[#FF5F57]" />
          <span className="size-3 rounded-full bg-[#FEBC2E]" />
          <span className="size-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="mx-auto flex w-full max-w-xs items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-[11px] text-zinc-400">
            localhost:3000
          </span>
        </div>
        <div className="hidden w-10 sm:block" />
      </div>

      <div className="grid h-[340px] grid-cols-[22%_1fr_31%] sm:h-[380px]">
        {/* Explorer */}
        <div className="border-r border-zinc-100 bg-zinc-50/60 p-3">
          <p className="mb-3 px-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Explorer
          </p>
          <div className="space-y-1.5">
            {TREE.map((item) => (
              <div
                key={item.name}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-1.5 py-1",
                  item.active && "bg-iris-soft",
                )}
                style={{ paddingLeft: `${item.depth * 12 + 6}px` }}
              >
                <span
                  className={cn(
                    "size-3.5 shrink-0 rounded-[4px]",
                    item.folder ? "bg-amber-300/80" : item.active
                      ? "bg-iris"
                      : "bg-zinc-300",
                  )}
                />
                <span
                  className={cn(
                    "h-2 rounded-[3px]",
                    item.active ? "w-3/4 bg-iris/70" : "w-2/3 bg-zinc-300",
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Code */}
        <div className="flex flex-col">
          <div className="flex h-10 items-center gap-2 border-b border-zinc-100 px-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5">
              <span className="size-2 rounded-full bg-iris" />
              <span className="h-2 w-12 rounded bg-zinc-400" />
            </div>
            <span className="h-2 w-10 rounded bg-zinc-200" />
          </div>
          <div className="flex-1 space-y-2.5 overflow-hidden p-4">
            <CodeLine
              tokens={[
                { text: "34px", tone: "bg-violet-300" },
                { text: "52px" },
                { text: "26px", tone: "bg-sky-300" },
              ]}
            />
            <CodeLine
              tokens={[
                { text: "48px", tone: "bg-violet-300" },
                { text: "60px" },
              ]}
              width="w-4/5"
            />
            <CodeLine
              tokens={[
                { text: "26px", tone: "bg-emerald-300" },
                { text: "42px" },
                { text: "30px" },
              ]}
              width="w-3/5"
            />
            <CodeLine tokens={[{ text: "70px" }]} width="w-2/3" />
            <CodeLine
              tokens={[
                { text: "38px", tone: "bg-sky-300" },
                { text: "44px", tone: "bg-violet-300" },
              ]}
              width="w-3/4"
            />
            <CodeLine tokens={[{ text: "58px" }]} width="w-1/2" />
            <CodeLine
              tokens={[
                { text: "30px", tone: "bg-emerald-300" },
                { text: "50px" },
              ]}
              width="w-4/5"
            />
            <CodeLine tokens={[{ text: "40px" }]} width="w-2/5" />
          </div>
        </div>

        {/* Preview */}
        <div className="hidden flex-col border-l border-zinc-100 bg-zinc-100/70 p-3 sm:flex">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-1 rounded-lg bg-white p-0.5 ring-1 ring-zinc-200">
              <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-[9px] font-semibold text-white">
                Preview
              </span>
              <span className="px-2.5 py-1 text-[9px] font-medium text-zinc-400">
                AI
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200/70">
            <span className="mb-3 rounded-full bg-iris-soft px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-iris">
              React
            </span>
            <span className="mb-2 h-3.5 w-3/4 rounded bg-zinc-800" />
            <span className="mb-1.5 h-2.5 w-full rounded bg-zinc-200" />
            <span className="mb-5 h-2.5 w-4/5 rounded bg-zinc-200" />
            <span className="h-7 w-24 rounded-lg bg-zinc-900" />
          </div>
        </div>
      </div>
    </div>
  );
}
