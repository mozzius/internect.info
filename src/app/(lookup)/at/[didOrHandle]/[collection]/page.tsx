import { Metadata } from "next";

import { CollectionInfo } from "~/components/info/collection-info";
import { agent } from "~/lib/agent";
import { parseParams } from "~/lib/params";

interface Props {
  params: Promise<{ didOrHandle: string; collection: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  let { didOrHandle, collection } = await params;
  didOrHandle = decodeURIComponent(didOrHandle);

  try {
    const profile = await agent.getProfile({ actor: didOrHandle });

    return {
      title: `${collection} - @${profile.data.handle} - internect.info`,
      description: `${collection} records from ${
        profile.data.displayName || `@${profile.data.handle}`
      }`,
    };
  } catch {
    return {
      title: `${collection} - @${didOrHandle} - internect.info`,
      description: `${collection} records from @${didOrHandle}`,
    };
  }
};

export default async function CollectionInfoScreen({ params }: Props) {
  const { did, collection } = await parseParams(params);

  return <CollectionInfo did={did} collection={collection} />;
}
