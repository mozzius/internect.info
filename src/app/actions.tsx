"use server";

import { redirect } from "next/navigation";
import { getAgent } from "~/lib/agent";

export async function resolveHandle(_: string | undefined, formData: FormData) {
  let handle = formData.get("handle");
  if (typeof handle !== "string") return;

  handle = handle.trim();

  if (handle === "") return "Please enter a handle.";

  if (handle.startsWith('https://bsky.app/profile/')) {
    handle = handle.replace('https://bsky.app/profile/', '');
    if (handle.endsWith('/')) handle = handle.slice(0, -1);
  }

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
      if (res.data.did.startsWith("did:plc:")) {
        redirect(`/did/${res.data.did}`);
      } else {
        return "Non-PLC DIDs are not supported by this tool.";
      }
    } else {
      return "Handle not found. Are you sure it's correct?";
    }
  }
}
