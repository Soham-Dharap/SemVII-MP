import { Header } from "@/features/home/components/header";
import { Footer } from "@/features/home/components/footer";
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col">
      <Header />
      <main className="flex-1 w-full relative bg-[#0A0A0B]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
