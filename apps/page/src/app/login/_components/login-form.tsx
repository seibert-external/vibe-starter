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
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Login to your account</p>
        </div>
        {error && (
          <div className="border-destructive bg-destructive/10 mb-4 rounded-md border p-3">
            <p className="text-destructive text-sm font-medium">Error</p>
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
        <div className="grid gap-6">
          <SeibertLoginButton />
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Need help?
            </span>
          </div>
          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account? Contact the administrator.
          </p>
          {dbName && (
            <p className="text-muted-foreground text-center text-xs">
              DB: {dbName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
