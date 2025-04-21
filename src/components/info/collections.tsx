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
}: {
  did: string;
  pds: string;
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
    <Card className="gap-3">
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
        {repo.collections.map((collection) => (
          <div key={collection}>
            <code className="text-sm">{collection}</code>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
