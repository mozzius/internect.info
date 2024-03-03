import { NextResponse } from "next/server";
import {
  lexArray,
  lexBlob,
  lexBoolean,
  lexBytes,
  lexCidLink,
  lexInteger,
  lexObject,
  lexRecord,
  lexString,
  lexToken,
  lexUnknown,
  lexXrpcProcedure,
  lexXrpcQuery,
  lexXrpcSubscription,
} from "@atproto/lexicon";
import { NSID } from "@atproto/syntax";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const revalidate = 60 * 60 * 24; // 24 hours

export const GET = async () => {
  const schema = zodToJsonSchema(
    // copied from lexiconDoc, but defs changed to union
    z
      .object({
        $schema: z.string().optional(),
        lexicon: z.literal(1),
        id: z.string().refine((v: string) => NSID.isValid(v), {
          message: "Must be a valid NSID",
        }),
        revision: z.number().optional(),
        description: z.string().optional(),
        defs: z.record(
          z.union([
            lexRecord,
            lexXrpcQuery,
            lexXrpcProcedure,
            lexXrpcSubscription,
            lexBlob,
            lexArray,
            lexToken,
            lexObject,
            lexBoolean,
            lexInteger,
            lexString,
            lexBytes,
            lexCidLink,
            lexUnknown,
          ]),
        ),
      })
      .strict(),
  );
  return NextResponse.json(schema);
};
