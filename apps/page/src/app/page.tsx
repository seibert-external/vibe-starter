import { Button } from "@seibert/react-ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-sds-rich-black">
          🚀 Your project is running!
        </h1>
        <p className="mt-3 text-lg text-sds-gray-400">
          Everything is set up and working correctly.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard →</Link>
      </Button>
    </div>
  );
}
