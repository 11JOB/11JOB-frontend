import AuthHeader from "@/components/auth-heaer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <AuthHeader />
      <main className="flex-1  min-h-screen">{children}</main>
    </div>
  );
}
