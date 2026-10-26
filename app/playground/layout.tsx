export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen min-h-[100dvh] bg-background overflow-x-hidden">{children}</div>;
}
