import Link from "next/link";
import { AtpAgent } from "@atproto/api";
import { LibraryBigIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function Collections({
  did,
  pds,
  current,
}: {
  did: string;
  pds: string;
  current?: string;
}) {
  const agent = new AtpAgent({ service: pds });

  let repo;
  try {
    const res = await agent.com.atproto.repo.describeRepo({ repo: did });
    repo = res.data;
  } catch (err) {
    console.error(err);
    return null;
  }

  if (!repo) {
    return null;
  }

  return (
    <Card className="max-w-full gap-3 overflow-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-2xl">
              <LibraryBigIcon className="size-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-xl">Collections</CardTitle>
              <CardDescription>Public repository data, by type</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {repo.collections.map((collection) =>
          current === collection ? (
            <div
              key={collection}
              className="mt-0.5 block font-mono text-sm font-medium text-gray-500"
            >
              {collection}
            </div>
          ) : (
            <Link
              key={collection}
              href={`/at/${did}/${collection}`}
              className="mt-0.5 block font-mono text-sm text-blue-500 hover:underline"
            >
              {collection}
            </Link>
          ),
        )}
      </CardContent>
    </Card>
  );
}
