"use server";

import { redirect } from "next/navigation";
import { getAgent } from "~/lib/agent";

export async function resolveHandle(_: string | undefined, formData: FormData) {
  let handle = formData.get("handle");
  if (typeof handle !== "string") return;
  if (handle.startsWith("did:")) {
    if (handle.startsWith("did:plc:")) {
      redirect(`/did/${handle}`);
    } else {
      return "Non-PLC DIDs are not supported by this tool.";
    }
  } else {
    if (handle.startsWith("@")) handle = handle.slice(1);
    const agent = getAgent();

    const res = await agent.resolveHandle({ handle }).catch((err) => {
      return { success: false as const };
    });

    if (res.success) {
      redirect(`/did/${res.data.did}`);
    } else {
      return "Handle not found. Are you sure it's correct?";
    }
  }
}
