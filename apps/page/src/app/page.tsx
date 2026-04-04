import { Button } from "@seibert/react-ui/button";
import Link from "next/link";
import { env } from "~/env";

const sanitizeDbUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}:${parsed.port}${parsed.pathname}`;
  } catch {
    return "(invalid URL)";
  }
};

export default function Page() {
  const dbInfo = sanitizeDbUrl(env.POSTGRES_URL);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-sds-rich-black text-4xl font-bold tracking-tight">
          🚀 Your project is running!
        </h1>
        <p className="text-sds-gray-400 mt-3 text-lg">
          Everything is set up and working correctly.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard →</Link>
      </Button>
      <div className="bg-sds-gray-50 text-sds-gray-400 mt-4 rounded-lg border px-4 py-3 font-mono text-sm">
        🗄️ DB: {dbInfo}
      </div>
    </div>
  );
}
