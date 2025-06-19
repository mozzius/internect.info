import { Metadata } from "next";

import { ActorInfo } from "~/components/info/actor-info";
import { agent } from "~/lib/agent";
import { parseParams } from "~/lib/params";

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

export default async function ActorInfoScreen({ params }: Props) {
  const { did } = await parseParams(params);

  return <ActorInfo did={did} />;
}
