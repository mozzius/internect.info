import Link from "next/link";
import { Form } from "./form";
import { GithubIcon } from "lucide-react";

export default function Home({
  searchParams: { error },
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 p-4 lg:p-24 max-w-xl mx-auto">
      <Link
        href="https://github.com/mozzius/resolve-handle"
        className="p-4 absolute top-1 right-1"
      >
        <GithubIcon
          className="text-gray-500 hover:text-gray-700 transition-colors"
          size={20}
        />
      </Link>
      <div>
        <p className="font-mono px-1.5 border rounded inline py-1">internect.info</p>
        <h1 className="scroll-m-20 mt-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Resolve a <span className="text-blue-500">Bluesky</span> handle
        </h1>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Form />
    </main>
  );
}
