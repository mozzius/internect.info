import Link from "next/link";
import { GithubIcon } from "lucide-react";

import { Form } from "./form";

export default function Home({
  searchParams: { error },
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center gap-16 p-4 lg:p-24">
      <Link
        href="https://github.com/mozzius/resolve-handle"
        className="absolute right-1 top-1 p-4"
      >
        <GithubIcon
          className="text-gray-500 transition-colors hover:text-gray-700"
          size={20}
        />
      </Link>
      <div>
        <p className="font-mono text-lg">internect.info</p>
        <h1 className="mt-2 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Resolve a <span className="text-[#0085ff]">Bluesky</span> handle
        </h1>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Form />
    </main>
  );
}
