import { Header } from "~/components/layout/header";
import { getServerAuthSession } from "~/server/auth";

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  const displayName = session?.user.name ?? session?.user.email ?? "there";

  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Hello, {displayName}!</p>
      </div>
    </>
  );
}
