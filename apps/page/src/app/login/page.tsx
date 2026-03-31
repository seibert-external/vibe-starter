import { redirect } from "next/navigation";
import { LoginForm } from "~/app/login/_components/login-form";
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";

export type NextSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

function getDatabaseName(): string | undefined {
  try {
    return new URL(env.POSTGRES_URL).pathname.replace(/^\//, "");
  } catch {
    return undefined;
  }
}

export default async function Login({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const session = await getServerAuthSession();
  const params = await searchParams;
  const error = params.error as string | undefined;
  if (session?.user) {
    redirect("/dashboard");
  }

  const dbName = getDatabaseName();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-sds-gray-50 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm error={error} dbName={dbName} />
      </div>
    </div>
  );
}
