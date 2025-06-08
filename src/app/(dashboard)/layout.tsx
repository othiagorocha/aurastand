import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/navigation/sidebar";
import { Header } from "@/components/navigation/header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 flex flex-col min-w-0'>
          <Header user={user} />
          <main className='flex-1 p-6 overflow-auto'>{children}</main>
        </div>
      </div>
    </div>
  );
}
