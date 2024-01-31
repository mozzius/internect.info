import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getAgent } from "~/lib/agent";

export default function Home({
  searchParams: { error },
}: {
  searchParams: { error?: string };
}) {
  async function handleSubmit(formData: FormData) {
    "use server";
    let handle = formData.get("handle");
    if (typeof handle !== "string") return;
    if (handle.startsWith("did:")) {
      redirect(`/did/${encodeURIComponent(handle)}`);
    } else {
      if (handle.startsWith("@")) handle = handle.slice(1);
      const agent = getAgent();

      const res = await agent.resolveHandle({ handle }).catch((err) => {
        return { success: false as const };
      });

      if (res.success) {
        redirect(`/did/${encodeURIComponent(res.data.did)}`);
      } else {
        redirect(
          `/?error=${encodeURIComponent(
            "Handle not found. Are you sure it's correct?"
          )}`
        );
      }
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 p-4 lg:p-24 max-w-xl mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Resolve a <span className="text-blue-500">Bluesky</span> handle
      </h1>
      <form className="flex w-full items-start space-x-2" action={handleSubmit}>
        <div className="flex-1">
          <Input
            name="handle"
            type="text"
            placeholder="alice.bsky.social"
            required
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">
              {decodeURIComponent(error)}
            </p>
          )}
        </div>
        <Button type="submit" variant="secondary">
          Resolve
        </Button>
      </form>
    </main>
  );
}
