import { Metadata } from "next";

import { parseParams } from "~/lib/params";

interface Props {
  params: Promise<{ didOrHandle: string; collection: string; rkey: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  let { didOrHandle, collection, rkey } = await params;
  didOrHandle = decodeURIComponent(didOrHandle);

  return {
    title: `at://${didOrHandle}/${collection}/${rkey} - internect.info`,
    description: `Info about at://${didOrHandle}/${collection}/${rkey}`,
  };
};

export default async function RecordInfoScreen({ params }: Props) {
  const { did } = await parseParams(params);

  return <span>todo</span>;
}
