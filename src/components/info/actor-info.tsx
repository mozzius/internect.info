import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Code } from "bright";
import {
  AtSignIcon,
  CalendarIcon,
  CircleUserRound,
  ExternalLinkIcon,
  ServerIcon,
} from "lucide-react";

import { FallbackCard } from "~/components/fallback-card";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { getDidDoc } from "~/lib/did-resolution";
import { BlueskyInfo, BlueskyInfoFallback } from "./bluesky-info";
import Collections from "./collections";
import { CopyButton } from "./copy-button";
import { DateTime } from "./datetime";
import { HistoryDialog } from "./history";

export async function ActorInfo({ did }: { did: string }) {
  if (!did.startsWith("did:")) {
    redirect(`/?error=${encodeURIComponent(`${did} is an invalid DID`)}`);
  }

  const { doc, audit, pds, didDomain } = await getDidDoc(did);

  const serviceEndpoint = pds?.serviceEndpoint ?? "???";

  let isBskyHost = false;

  if (pds?.serviceEndpoint.endsWith("host.bsky.network")) {
    isBskyHost = true;
  }

  return (
    <div className="grid gap-6">
      {/* User Card */}
      <Card className="pb-0">
        <CardHeader>
          <Suspense fallback={<BlueskyInfoFallback />}>
            <BlueskyInfo did={did} />
          </Suspense>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="text-muted-foreground flex items-center text-sm">
                <CircleUserRound className="mr-2 size-4" />
                <span>DID</span>
              </div>
              <div className="bg-muted/60 flex items-center justify-between rounded-md p-3">
                <code className="text-xs sm:text-sm">{did}</code>
                <div className="-my-1.5">
                  <CopyButton text={did} tooltip="Copy DID" />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-muted-foreground flex items-center text-sm">
                <AtSignIcon className="mr-2 size-4" />
                <span>Names and aliases</span>
                <HistoryDialog log={audit} />
              </div>
              <div className="bg-muted/60 flex items-center justify-between rounded-md p-3">
                <div className="flex flex-1 flex-col gap-1">
                  {doc.alsoKnownAs ? (
                    doc.alsoKnownAs.map((name) => (
                      <code key={name} className="text-xs sm:text-sm">
                        {name}
                      </code>
                    ))
                  ) : (
                    <span className="text-xs italic sm:text-sm">None</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-muted-foreground flex items-center text-sm">
                <CalendarIcon className="mr-2 size-4" />
                <span>First appearance</span>
              </div>
              <div className="bg-muted/60 rounded-md p-3">
                <code className="block text-xs sm:text-sm">
                  {did.startsWith("did:plc:") && (
                    <DateTime date={new Date(audit[0].createdAt)} />
                  )}
                  {did.startsWith("did:web:") && <>Unavailable for web DIDs</>}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 flex flex-wrap justify-between gap-2 border-t px-6 pb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View DID document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>DID Document</DialogTitle>
              </DialogHeader>
              {/* <div className="max-h-[80vh] overflow-auto"> */}
              <Code
                lang="json"
                lineNumbers
                className="!my-0 [&>pre]:max-h-[80vh]"
                codeClassName="text-sm"
              >
                {JSON.stringify(doc, null, 2)}
              </Code>
              {/* </div> */}
            </DialogContent>
          </Dialog>
          {did.startsWith("did:plc:") && (
            <Link href={`https://web.plc.directory/did/${did}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <span>View on plc.directory</span>
                <ExternalLinkIcon className="ml-2 inline-block" size={14} />
              </Button>
            </Link>
          )}
          {did.startsWith("did:web:") && (
            <Link href={`https://${didDomain}/.well-known/did.json`}>
              <Button variant="outline" size="sm" className="gap-2">
                <span>Go to document</span>
                <ExternalLinkIcon className="ml-2 inline-block" size={14} />
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
      {/* PDS Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-2xl">
                {isBskyHost ? (
                  "🍄"
                ) : (
                  <ServerIcon className="size-5 text-blue-500" />
                )}
              </div>
              <div>
                <CardTitle className="text-xl">Personal Data Server</CardTitle>
                <CardDescription>Host information</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/60 rounded-md p-3">
            <div className="flex items-center justify-between">
              <code className="text-sm">{serviceEndpoint}</code>
              <div className="-my-1.5">
                <CopyButton text={serviceEndpoint} tooltip="Copy PDS URL" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {pds?.serviceEndpoint && (
        <Suspense fallback={<FallbackCard />}>
          <Collections did={did} pds={pds.serviceEndpoint} />
        </Suspense>
      )}
    </div>
  );
}
