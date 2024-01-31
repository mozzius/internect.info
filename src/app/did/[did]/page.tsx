/* eslint-disable @next/next/no-img-element */
import {
  CakeIcon,
  CalendarIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getAgent } from "~/lib/agent";

export default async function InfoScreen({
  params: { did },
}: {
  params: { did: string };
}) {
  did = decodeURIComponent(did);
  if (!did.startsWith("did:")) {
    redirect(`/did/${encodeURIComponent(`${did} is an invalid DID`)}`);
  }

  const agent = getAgent();

  const doc = (await fetch(`https://plc.directory/${did}`)
    .then((res) => res.json())
    .catch(() =>
      redirect(
        `/?error=${encodeURIComponent(
          `Could not find "${did}" in the PLC directory`
        )}`
      )
    )) as {
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

  const audit = await fetch(`https://plc.directory/${did}/log/audit`).then(
    (res) => res.json()
  );

  console.log(doc);

  // console.log(audit);

  const profile = await agent.getProfile({ actor: did });

  const intl = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const pds = doc.service?.find((s) => s.type === "AtprotoPersonalDataServer");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 lg:p-24 max-w-4xl mx-auto">
      <h1 className="scroll-m-20 mb-8 text-4xl font-extrabold tracking-tight break-all">
        {did}
      </h1>
      <Link
        className="rounded-md border w-full py-3 px-4 items-center flex gap-4 border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50"
        href={`https://bsky.app/profile/${did}`}
      >
        <img
          src={profile.data.avatar}
          alt={profile.data.displayName ?? profile.data.handle}
          className="rounded-full w-14 h-14"
        />
        <div>
          <p className="text-xl font-semibold">
            {profile.data.displayName ?? profile.data.handle}
          </p>
          <p className="text-gray-500 text-sm">@{profile.data.handle}</p>
        </div>
      </Link>
      <div className="rounded-md w-full py-3 px-4 flex flex-col gap-2 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="flex gap-2 items-center">
          <UserIcon className="inline-block text-gray-500" size={14} />
          <p className="text-sm">
            <span className="text-gray-500">Names and aliases:</span>{" "}
            {doc.alsoKnownAs?.join(", ") ?? "None"}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <CakeIcon className="inline-block text-gray-500" size={14} />
          <p className="text-sm">
            <span className="text-gray-500">First appearance:</span>{" "}
            {intl.format(new Date(audit[0].createdAt))}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <DatabaseIcon className="inline-block text-gray-500" size={14} />
          <p className="text-sm">
            <span className="text-gray-500">Personal Data Server:</span>{" "}
            {pds ? pds.serviceEndpoint : "Not specified"}
          </p>
        </div>
      </div>
      <div className="flex justify-between w-full">
        <Link href="/">
          <Button variant="link">Back</Button>
        </Link>
        <Link href={`https://web.plc.directory/did/${did}`}>
          <Button variant="outline">
            View on plc.directory
            <ExternalLinkIcon className="inline-block ml-2" size={14} />
          </Button>
        </Link>
      </div>
    </main>
  );
}
