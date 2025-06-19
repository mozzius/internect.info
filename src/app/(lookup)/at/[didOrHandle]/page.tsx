import { Metadata } from "next";
import { redirect } from "next/navigation";

import { ActorInfo } from "~/components/info/actor-info";
import { agent } from "~/lib/agent";

interface Props {
  params: Promise<{ didOrHandle: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  let { didOrHandle } = await params;
  didOrHandle = decodeURIComponent(didOrHandle);

  try {
    const profile = await agent.getProfile({ actor: didOrHandle });

    return {
      title: `@${profile.data.handle} - internect.info`,
      description: `Information about ${
        profile.data.displayName || `@${profile.data.handle}`
      }`,
    };
  } catch {
    return {
      title: `@${didOrHandle} - internect.info`,
      description: `Information about @${didOrHandle}`,
    };
  }
};

export default async function InfoScreen({ params }: Props) {
  let { didOrHandle } = await params;
  didOrHandle = decodeURIComponent(didOrHandle);

  let did: string;

  if (didOrHandle.startsWith("did:")) {
    did = didOrHandle;
  } else {
    const res = await agent
      .resolveHandle({ handle: didOrHandle })
      .catch(() => ({ success: false as const }));

    if (!res.success) {
      error("Handle not found. Are you sure it's correct?");
      return; // weird that typescript needs this, when `error` returns `never`
    }

    did = res.data.did;
  }

  if (!did.startsWith("did:plc:") && !did.startsWith("did:web:")) {
    error("Only PLC & web DIDs are currently supported by this tool.");
  }

  return <ActorInfo did={did} />;
}

const error = (msg: string) => redirect(`/?error=${encodeURIComponent(msg)}`);
