/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { ActorInfo } from "~/components/info/actor-info";
import { agent } from "~/lib/agent";

interface Props {
  params: Promise<{ handle: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  let { handle } = await params;
  handle = decodeURIComponent(handle);

  try {
    const profile = await agent.getProfile({ actor: handle });

    return {
      title: `@${profile.data.handle} - internect.info`,
      description: `Information about ${
        profile.data.displayName || `@${profile.data.handle}`
      }`,
    };
  } catch {
    return {
      title: `@${handle} - internect.info`,
      description: `Information about @${handle}`,
    };
  }
};

export default async function InfoScreen({ params }: Props) {
  let { handle } = await params;
  handle = decodeURIComponent(handle);

  const res = await agent.resolveHandle({ handle }).catch((err) => {
    return { success: false as const };
  });

  if (res.success) {
    if (
      res.data.did.startsWith("did:plc:") ||
      res.data.did.startsWith("did:web:")
    ) {
      return <ActorInfo did={res.data.did} />;
    } else {
      error("Only PLC & web DIDs are currently supported by this tool.");
    }
  } else {
    error("Handle not found. Are you sure it's correct?");
  }
}

const error = (msg: string) => redirect(`/?error=${encodeURIComponent(msg)}`);
