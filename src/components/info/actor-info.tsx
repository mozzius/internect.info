/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { redirect } from "next/navigation";
import { SiBluesky as BlueskyIcon } from "@icons-pack/react-simple-icons";
import { Code } from "bright";
import {
  AtSignIcon,
  CalendarIcon,
  CircleUserRound,
  ExternalLinkIcon,
  ServerIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { agent } from "~/lib/agent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { CopyButton } from "./copy-button";
import { DateTime } from "./datetime";
import { AuditRecord, HistoryDialog } from "./history";

type DidDocument = {
  "@context": string[];
  id: string;
  alsoKnownAs?: string[];
  verificationMethod?: {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase?: string;
  }[];
  service?: { id: string; type: string; serviceEndpoint: string }[];
};

export async function ActorInfo({ did }: { did: string }) {
  if (!did.startsWith("did:")) {
    redirect(`/?error=${encodeURIComponent(`${did} is an invalid DID`)}`);
  }

  let doc: DidDocument, audit: AuditRecord[], didDomain: string | null;
  if (did.startsWith("did:plc:")) {
    didDomain = null;

    doc = (await fetch(`https://plc.directory/${did}`, {
      cache: "no-store",
    }).then((res) => res.json())) as DidDocument;

    audit = (await fetch(`https://plc.directory/${did}/log/audit`, {
      cache: "no-store",
    }).then((res) => res.json())) as AuditRecord[];
  } else if (did.startsWith("did:web:")) {
    didDomain = did.split(":", 3)[2];

    doc = (await fetch(`https://${didDomain}/.well-known/did.json`, {
      cache: "no-store",
    }).then((res) => res.json())) as DidDocument;

    audit = [];
  } else {
    throw Error("unsupported DID method");
  }

  const profile = await agent.getProfile({ actor: did }).catch((err) => {
    if (err instanceof Error && err.message.includes("deactivated")) {
      return "DEACTIVATED" as const;
    } else {
      redirect(`/?error=${encodeURIComponent(`Could not find "${did}"`)}`);
    }
  });

  const pds = doc.service?.findLast(
    (s) => s.type === "AtprotoPersonalDataServer",
  );

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
          {profile === "DEACTIVATED" ? (
            <CardTitle className="text-2xl">
              This account has been deactivated
            </CardTitle>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="size-10 outline-1 outline-neutral-200">
                <AvatarImage
                  src={profile.data.avatar?.replace(
                    "/img/avatar/plain/",
                    "/img/avatar_thumbnail/plain/",
                  )}
                />
                <AvatarFallback>
                  {(profile.data.displayName || profile.data.handle)
                    .split(" ")
                    .map((word) => word.charAt(0))
                    .slice(0, 2)
                    .join("")
                    .toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {profile.data.displayName || profile.data.handle}
                </CardTitle>
                <CardDescription>@{profile.data.handle}</CardDescription>
              </div>
              <Badge
                variant="outline"
                className="ml-auto flex items-center gap-1.5"
              >
                <BlueskyIcon className="size-3" />
                <span>Bluesky</span>
              </Badge>
            </div>
          )}
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
                <CopyButton text={did} tooltip="Copy DID" />
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
                <code className="text-xs sm:text-sm">
                  {did.startsWith("did:plc:") && (
                    <DateTime date={new Date(audit[0].createdAt)} />
                  )}
                  {did.startsWith("did:web:") && <>Unavailable for web DIDs</>}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 flex flex-wrap justify-between gap-2 border-t px-6 pt-4 pb-6">
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
            <Badge variant="outline" className="ml-auto">
              {isBskyHost ? "Hosted by Bluesky" : "Independently hosted"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/60 rounded-md p-3">
            <div className="flex items-center justify-between">
              <code className="text-sm">{serviceEndpoint}</code>
              <CopyButton text={serviceEndpoint} tooltip="Copy PDS URL" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
