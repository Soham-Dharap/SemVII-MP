import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Foreground-tinted base stays visible on light AND dark surfaces;
        // the moving highlight reads as a YouTube-style content shimmer.
        "animate-shimmer rounded-md bg-foreground/[0.08] bg-[length:200%_100%] bg-[linear-gradient(100deg,transparent_25%,var(--foreground)/0.10_50%,transparent_75%)]",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
