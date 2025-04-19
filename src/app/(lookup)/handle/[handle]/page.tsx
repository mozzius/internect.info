import { redirect } from "next/navigation";

import { agent } from "~/lib/agent";

export default async function HandleRedirector({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const res = await agent.resolveHandle({ handle }).catch((err) => {
    return { success: false as const };
  });

  if (res.success) {
    if (
      res.data.did.startsWith("did:plc:") ||
      res.data.did.startsWith("did:web:")
    ) {
      redirect(`/did/${res.data.did}`);
    } else {
      error("Only PLC & web DIDs are currently supported by this tool.");
    }
  } else {
    error("Handle not found. Are you sure it's correct?");
  }
}

const error = (msg: string) => redirect(`/?error=${encodeURIComponent(msg)}`);
