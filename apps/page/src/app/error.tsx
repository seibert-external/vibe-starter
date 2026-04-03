"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-sds-gray-50 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <div className="border-sds-error-700 bg-sds-error-300/15 rounded-lg border p-4">
          <p className="text-sds-error-700 font-semibold">Error</p>
          <p className="text-sds-error-700 mt-1 text-sm">{error.message}</p>
        </div>
      </div>
    </div>
  );
}
