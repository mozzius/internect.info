import { Form } from "./form";

export default function Home({
  searchParams: { error },
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 p-4 lg:p-24 max-w-xl mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Resolve a <span className="text-blue-500">Bluesky</span> handle
      </h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Form />
    </main>
  );
}
