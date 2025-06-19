import { redirect } from "next/navigation";

import { agent } from "./agent";

export async function parseParams<T extends Promise<{ didOrHandle: string }>>(
  params: T,
) {
  let { didOrHandle, ...rest } = await params;
  didOrHandle = decodeURIComponent(didOrHandle);

  let did: string;

  if (didOrHandle.startsWith("did:")) {
    did = didOrHandle;
  } else {
    const res = await agent
      .resolveHandle({ handle: didOrHandle })
      .catch(() => ({ success: false as const }));

    if (!res.success) {
      return error("Handle not found. Are you sure it's correct?");
    }

    did = res.data.did;
  }

  if (!did.startsWith("did:plc:") && !did.startsWith("did:web:")) {
    return error("Only PLC & web DIDs are currently supported by this tool.");
  }

  return {
    did,
    ...rest,
  };
}

const error = (msg: string) => redirect(`/?error=${encodeURIComponent(msg)}`);
