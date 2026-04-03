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
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="border-border rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-sds-rich-black text-xl font-semibold">
            Welcome back
          </h1>
          <p className="text-sds-gray-400 mt-1 text-sm">
            Login to your account
          </p>
        </div>
        {error && (
          <div className="border-sds-error-700 bg-sds-error-300/15 mb-4 rounded-lg border p-3">
            <p className="text-sds-error-700 text-sm font-semibold">Error</p>
            <p className="text-sds-error-700 text-sm">{error}</p>
          </div>
        )}
        <div className="grid gap-6">
          <SeibertLoginButton />
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="text-sds-gray-400 relative z-10 bg-white px-2">
              Need help?
            </span>
          </div>
          <p className="text-sds-gray-400 text-center text-sm">
            Don&apos;t have an account? Contact the administrator.
          </p>
          {dbName && (
            <p className="text-sds-gray-300 text-center text-xs">
              DB: {dbName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
