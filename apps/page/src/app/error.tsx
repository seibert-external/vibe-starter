"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-sds-gray-50 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <div className="rounded-lg border border-sds-error-700 bg-sds-error-300/15 p-4">
          <p className="font-semibold text-sds-error-700">Error</p>
          <p className="mt-1 text-sm text-sds-error-700">{error.message}</p>
        </div>
      </div>
    </div>
  );
}
