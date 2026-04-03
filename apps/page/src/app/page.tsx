import { Button } from "@seibert/react-ui/button";
import Link from "next/link";

export default function Page() {
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
    </div>
  );
}
