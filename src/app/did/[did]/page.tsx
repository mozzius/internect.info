/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AtSign,
  AtSignIcon,
  CakeIcon,
  CalendarIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  UserIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { getAgent } from "~/lib/agent";
import { CopyableText } from "./copyable-text";
import { DateTime } from "./datetime";
import { AuditRecord, HistoryDialog } from "./history";

interface Props {
  params: { did: string };
}

export const generateMetadata = async ({
  params: { did },
}: Props): Promise<Metadata> => {
  did = decodeURIComponent(did);
  const agent = getAgent();

  const profile = await agent.getProfile({ actor: did });

  return {
    title: `@${profile.data.handle} - internect.info`,
    description: `Information about ${
      profile.data.displayName || `@${profile.data.handle}`
    }`,
  };
};

export default async function InfoScreen({ params: { did } }: Props) {
  did = decodeURIComponent(did);
  if (!did.startsWith("did:")) {
    redirect(`/did/${encodeURIComponent(`${did} is an invalid DID`)}`);
  }

  const agent = getAgent();

  const doc = (await fetch(`https://plc.directory/${did}`, {
    cache: "no-store",
  }).then((res) => res.json())) as {
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

  const audit = (await fetch(`https://plc.directory/${did}/log/audit`, {
    cache: "no-store",
  }).then((res) => res.json())) as AuditRecord[];

  const profile = await agent
    .getProfile({ actor: did })
    .catch(() =>
      redirect(`/?error=${encodeURIComponent(`Could not find "${did}"`)}`),
    );

  const pds = doc.service?.findLast(
    (s) => s.type === "AtprotoPersonalDataServer",
  );

  let serviceEndpoint = pds?.serviceEndpoint ?? "???";

  let isBskyHost = false;

  if (pds?.serviceEndpoint.endsWith("host.bsky.network")) {
    isBskyHost = true;
    const mushroom = serviceEndpoint
      .replace("https://", "")
      .split(".")
      .shift()!;
    serviceEndpoint = `🍄 ${mushroom[0].toLocaleUpperCase()}${mushroom.slice(
      1,
    )}`;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 p-4 lg:p-24">
      <div className="flex w-full flex-col gap-2 text-center">
        <p>Personal Data Service:</p>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
          {serviceEndpoint}
        </h1>
        {pds && (
          <p className="mx-auto mt-2 max-w-max rounded-sm border bg-neutral-50 px-2 py-px">
            {isBskyHost
              ? "still in the mycosphere..."
              : "internecting in the ATmosphere!"}
          </p>
        )}
      </div>
      <Link
        className="mt-8 flex w-full items-center gap-4 rounded-md border border-slate-200 bg-white px-4 py-3 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50"
        href={`https://bsky.app/profile/${did}`}
      >
        <img
          src={profile.data.avatar}
          alt={profile.data.displayName ?? profile.data.handle}
          className="h-14 w-14 rounded-full"
        />
        <div>
          <p className="text-xl font-semibold">
            {profile.data.displayName ?? profile.data.handle}
          </p>
          <p className="text-sm text-gray-500">@{profile.data.handle}</p>
        </div>
      </Link>
      <div className="flex w-full flex-col gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm">
          <span className="relative flex items-center gap-2 pl-5 text-gray-500 md:inline-flex">
            <UserIcon
              className="absolute left-0 inline-block text-gray-500"
              size={14}
            />
            DID:
          </span>{" "}
          <CopyableText text={did} />
        </p>

        <p className="text-sm">
          <span className="relative flex items-center gap-2 pl-5 text-gray-500 md:inline-flex">
            <AtSignIcon
              className="absolute left-0 inline-block text-gray-500"
              size={14}
            />
            Names and aliases:
          </span>{" "}
          {doc.alsoKnownAs?.join(", ") ?? "None"} -{" "}
          <HistoryDialog log={audit} />
        </p>

        <p className="text-sm">
          <span className="relative flex items-center gap-2 pl-5 text-gray-500 md:inline-flex">
            <CakeIcon
              className="absolute left-0 inline-block text-gray-500"
              size={14}
            />
            First appearance:
          </span>{" "}
          <DateTime date={new Date(audit[0].createdAt)} />
        </p>

        <p className="text-sm">
          <span className="relative flex items-center gap-2 pl-5 text-gray-500 md:inline-flex">
            <DatabaseIcon
              className="absolute left-0 inline-block text-gray-500"
              size={14}
            />
            Personal Data Server:
          </span>{" "}
          {pds ? pds.serviceEndpoint : "Not specified"}
        </p>
      </div>
      <div className="flex w-full justify-between">
        <Link href="/">
          <Button variant="link">Back</Button>
        </Link>
        <Link href={`https://web.plc.directory/did/${did}`}>
          <Button variant="outline">
            View on plc.directory
            <ExternalLinkIcon className="ml-2 inline-block" size={14} />
          </Button>
        </Link>
      </div>
    </main>
  );
}
