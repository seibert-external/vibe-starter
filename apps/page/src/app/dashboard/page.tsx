import { Header } from "~/components/layout/header";
import { getServerAuthSession } from "~/server/auth";
import { DashboardContent } from "~/app/dashboard/_components/dashboard-content";

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  const displayName = session?.user.name ?? session?.user.email ?? "there";

  return (
    <>
      <Header />
      <main className="bg-sds-gray-50 flex-1">
        <DashboardContent displayName={displayName} />
      </main>
    </>
  );
}
