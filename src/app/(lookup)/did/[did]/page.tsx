/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";

import { ActorInfo } from "~/components/info/actor-info";
import { agent } from "~/lib/agent";

interface Props {
  params: Promise<{ did: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  let { did } = await params;
  did = decodeURIComponent(did);

  try {
    const profile = await agent.getProfile({ actor: did });

    return {
      title: `@${profile.data.handle} - internect.info`,
      description: `Information about ${
        profile.data.displayName || `@${profile.data.handle}`
      }`,
    };
  } catch {
    return {
      title: `@${did} - internect.info`,
      description: `Information about @${did}`,
    };
  }
};

export default async function InfoScreen({ params }: Props) {
  let { did } = await params;
  did = decodeURIComponent(did);

  return (
    <main>
      <ActorInfo did={did} />
    </main>
  );
}
