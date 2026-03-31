"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <div className="border-destructive bg-destructive/10 rounded-md border p-4">
          <p className="text-destructive font-medium">Error</p>
          <p className="text-destructive mt-1 text-sm">{error.message}</p>
        </div>
      </div>
    </div>
  );
}
