import { Header } from "@/features/home/components/header";
import { Footer } from "@/features/home/components/footer";
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 w-full bg-background">
        {children}
      </main>
      <Footer />
    </div>
  );
}
