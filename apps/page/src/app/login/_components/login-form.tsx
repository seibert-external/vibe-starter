import { cn } from "~/lib/utils";
import { SeibertLoginButton } from "~/app/login/_components/seibert-login-button";

export function LoginForm({
  error,
  dbName,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  error?: string;
  dbName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-sds-rich-black">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-sds-gray-400">
            Login to your account
          </p>
        </div>
        {error && (
          <div className="mb-4 rounded-lg border border-sds-error-700 bg-sds-error-300/15 p-3">
            <p className="text-sm font-semibold text-sds-error-700">Error</p>
            <p className="text-sm text-sds-error-700">{error}</p>
          </div>
        )}
        <div className="grid gap-6">
          <SeibertLoginButton />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-white px-2 text-sds-gray-400">
              Need help?
            </span>
          </div>
          <p className="text-center text-sm text-sds-gray-400">
            Don&apos;t have an account? Contact the administrator.
          </p>
          {dbName && (
            <p className="text-center text-xs text-sds-gray-300">
              DB: {dbName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
