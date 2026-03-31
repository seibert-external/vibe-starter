import { redirect } from "next/navigation";
import { DashboardProviders } from "~/components/dashboard-providers";
import { getServerAuthSession } from "~/server/auth";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardProviders>
      <div className="flex min-h-screen flex-col">{children}</div>
    </DashboardProviders>
  );
}
