/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  AtSignIcon,
  Calendar,
  Copy,
  ExternalLinkIcon,
  MouseIcon as Mushroom,
  SearchIcon,
  ServerIcon,
  User,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { agent } from "~/lib/agent";
import { CopyableText } from "./copyable-text";
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
  let pdsName = serviceEndpoint;

  let isBskyHost = false;

  if (pds?.serviceEndpoint.endsWith("host.bsky.network")) {
    isBskyHost = true;
    const mushroom = serviceEndpoint
      .replace("https://", "")
      .split(".")
      .shift()!;
    pdsName = `${mushroom[0].toLocaleUpperCase()}${mushroom.slice(1)}`;
  }

  return (
    <div className="container max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <AtSignIcon className="h-6 w-6 text-blue-500" />
          <span className="text-lg font-medium">internect.info</span>
        </Link>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <SearchIcon className="mr-2 size-4" />
            Back to search
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* PDS Card */}
        <Card className="overflow-hidden pt-0">
          <CardHeader className="bg-muted/30 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-2xl">
                  {isBskyHost ? (
                    "🍄"
                  ) : (
                    <ServerIcon className="text-muted-foreground size-5" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Personal Data Server
                  </CardTitle>
                  <CardDescription>Host information</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Mushroom className="size-3" />
                <span>PDS</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold">{pdsName}</h3>
                </div>
                <Badge variant="secondary" className="mt-2 w-fit sm:mt-0">
                  {isBskyHost
                    ? "still in the mycosphere..."
                    : "internecting in the ATmosphere!"}
                </Badge>
              </div>

              <div className="bg-muted/30 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <code className="text-sm">{serviceEndpoint}</code>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="size-4" />
                          <span className="sr-only">Copy URL</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy URL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Card */}
        <Card className="overflow-hidden py-0">
          <CardHeader className="bg-muted/30 pt-6 pb-4">
            {profile === "DEACTIVATED" ? (
              <CardTitle className="text-2xl">
                This account has been deactivated
              </CardTitle>
            ) : (
              <div className="flex items-center space-x-4">
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
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="text-muted-foreground flex items-center text-sm">
                  <User className="mr-2 size-4" />
                  <span>DID</span>
                </div>
                <div className="bg-muted/30 flex items-center justify-between rounded-md p-3">
                  <code className="text-xs sm:text-sm">{did}</code>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="size-4" />
                          <span className="sr-only">Copy DID</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy DID</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="text-muted-foreground flex items-center text-sm">
                  <AtSignIcon className="mr-2 size-4" />
                  <span>Names and aliases</span>
                </div>
                <div className="bg-muted/30 flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center">
                    <code className="text-xs sm:text-sm">
                      {doc.alsoKnownAs?.join(", ") ?? "None"}
                    </code>
                    <HistoryDialog log={audit} />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="text-muted-foreground flex items-center text-sm">
                  <Calendar className="mr-2 size-4" />
                  <span>First appearance</span>
                </div>
                <div className="bg-muted/30 rounded-md p-3">
                  <span className="text-sm">
                    {" "}
                    {did.startsWith("did:plc:") && (
                      <DateTime date={new Date(audit[0].createdAt)} />
                    )}
                    {did.startsWith("did:web:") && (
                      <>Unavailable for web DIDs</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 flex justify-between border-t px-6 pt-4 pb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Link>
            </Button>
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
                  <span>View DID document</span>
                  <ExternalLinkIcon className="ml-2 inline-block" size={14} />
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
