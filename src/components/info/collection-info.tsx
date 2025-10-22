import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Agent } from "@atproto/api";
import { BookCopyIcon } from "lucide-react";

import { FallbackCard } from "~/components/fallback-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getDidDoc } from "~/lib/did-resolution";
import { BlueskyInfo, BlueskyInfoFallback } from "./bluesky-info";
import Collections from "./collections";

export async function CollectionInfo({
  did,
  collection,
}: {
  did: string;
  collection: string;
}) {
  if (!did.startsWith("did:")) {
    redirect(`/?error=${encodeURIComponent(`${did} is an invalid DID`)}`);
  }

  const { pds } = await getDidDoc(did);

  return (
    <div className="grid gap-6">
      {/* User Card */}
      <Link href={`/at/${did}`}>
        <Card className="py-4">
          <CardHeader>
            <Suspense fallback={<BlueskyInfoFallback />}>
              <BlueskyInfo did={did} />
            </Suspense>
          </CardHeader>
        </Card>
      </Link>

      <Card className="max-w-full gap-3 overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-2xl">
                <BookCopyIcon className="size-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-xl">{collection}</CardTitle>
                <CardDescription>Records in this collection</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pds ? (
            <Suspense fallback={null}>
              <div className="flex flex-col gap-4">
                <Records
                  did={did}
                  pds={pds.serviceEndpoint}
                  collection={collection}
                />
              </div>
            </Suspense>
          ) : (
            <p>No data available</p>
          )}
        </CardContent>
      </Card>

      {pds?.serviceEndpoint && (
        <Suspense fallback={<FallbackCard />}>
          <Collections
            did={did}
            pds={pds.serviceEndpoint}
            current={collection}
          />
        </Suspense>
      )}
    </div>
  );
}

async function Records({
  did,
  pds,
  collection,
}: {
  did: string;
  pds: string;
  collection: string;
}) {
  const agent = new Agent({ service: pds });

  let records;
  try {
    const res = await agent.com.atproto.repo.listRecords({
      repo: did,
      collection,
      limit: 100,
    });
    records = res.data;
  } catch (err) {
    console.error(err);
    return null;
  }

  if (!records) {
    return null;
  }

  return (
    <>
      {records.records.map((record) => (
        <div
          key={record.uri}
          className="border-border flex w-full flex-col gap-2 rounded-md border p-4"
        >
          <p className="text-mono font-semibold">{record.uri}</p>
          <pre className="bg-accent border-border max-w-full overflow-auto rounded p-2 font-mono text-xs">
            {JSON.stringify(record.value, null, 2)}
          </pre>
        </div>
      ))}
    </>
  );
}
