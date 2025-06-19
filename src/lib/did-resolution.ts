import { AuditRecord } from "~/components/info/history";

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

export async function getDidDoc(did: string): Promise<{
  doc: DidDocument;
  audit: AuditRecord[];
  pds?: { id: string; type: string; serviceEndpoint: string };
  didDomain?: string;
}> {
  let doc: DidDocument, audit: AuditRecord[], didDomain: string | undefined;
  if (did.startsWith("did:plc:")) {
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

  const pds = doc.service?.findLast(
    (s) => s.type === "AtprotoPersonalDataServer",
  );

  return { doc, audit, pds, didDomain };
}
