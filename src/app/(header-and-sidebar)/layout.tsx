import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
