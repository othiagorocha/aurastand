import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/navigation/sidebar";
import { DashboardWrapper } from "@/components/navigation/dashboard-wrapper";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Sidebar />
      <DashboardWrapper user={user}>{children}</DashboardWrapper>
    </div>
  );
}
