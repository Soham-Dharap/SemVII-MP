import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import ContributionHeatmap from "@/features/profile/components/contribution-heatmap";
import { CalendarDays, FileCode2, FolderGit2, Star } from "lucide-react";

export const instant = false;

const STATS = [
  { key: "projects", label: "Projects", icon: FolderGit2 },
  { key: "files", label: "Files", icon: FileCode2 },
  { key: "stars", label: "Starred", icon: Star },
] as const;

function dayKey(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/sign-in");
  const userId = session.user.id;

  const [dbUser, accounts, projects, starred, files] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.account.findMany({ where: { userId }, select: { provider: true } }),
    db.playground.findMany({
      where: { userId },
      select: { id: true, createdAt: true },
    }),
    db.starMark.count({ where: { userId, isMarked: true } }),
    db.projectFile.findMany({
      where: { playground: { userId } },
      select: { createdAt: true, updatedAt: true },
    }),
  ]);

  // Each file creation and every saved edit is a contribution.
  const activity: Record<string, number> = {};
  for (const file of files) {
    const created = dayKey(file.createdAt);
    activity[created] = (activity[created] ?? 0) + 1;
    const updated = dayKey(file.updatedAt);
    if (updated !== created) {
      activity[updated] = (activity[updated] ?? 0) + 1;
    }
  }

  const stats = {
    projects: projects.length,
    files: files.length,
    stars: starred,
  };

  const joined = dbUser?.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto w-full max-w-5xl animate-fade-up space-y-6 px-4 py-10 sm:px-8">
      <header>
        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-iris">
          Account
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Your profile
        </h1>
      </header>

      {/* Identity card */}
      <section className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              dbUser?.image ??
              `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                dbUser?.name ?? "User",
              )}`
            }
            alt={dbUser?.name ?? "User"}
            className="size-16 rounded-2xl border border-border object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {dbUser?.name ?? "Codepilot user"}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {dbUser?.email}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {accounts.map((account: { provider: string }) => (
                <span
                  key={account.provider}
                  className="rounded-full bg-iris-soft px-3 py-1 text-xs font-semibold capitalize text-iris"
                >
                  {account.provider}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Joined {joined}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map(({ key, label, icon: Icon }, index) => (
          <div
            key={key}
            style={{ animationDelay: `${index * 70}ms` }}
            className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-iris-soft text-iris">
              <Icon className="size-5" />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {stats[key]}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <ContributionHeatmap activity={activity} />
    </div>
  );
};

export default ProfilePage;
