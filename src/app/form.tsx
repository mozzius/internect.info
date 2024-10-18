/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { getAgent } from "~/lib/agent";
import { resolveHandle } from "./actions";

export const Form = () => {
  const [error, action] = useFormState(resolveHandle, undefined);

  return (
    <form className="w-full space-y-2" action={action}>
      <div className="flex flex-1 items-center space-x-2">
        <Fields />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
};

const Fields = () => {
  const [text, setText] = useState("");
  const { pending } = useFormStatus();

  const agent = useMemo(() => getAgent(), []);

  const { data: suggestions } = useQuery({
    queryKey: ["suggestions", text],
    queryFn: async () => {
      if (text.startsWith("did:")) {
        const { data } = await agent.getProfile({ actor: text });
        return [data];
      } else {
        const { data } = await agent.searchActorsTypeahead({
          q: text,
          limit: 5,
        });
        return data.actors;
      }
    },
    enabled: text.length > 2,
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Input
            name="handle"
            type="text"
            placeholder="alice.bsky.social"
            required
            disabled={pending}
            className="text-base"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
          />
        </PopoverTrigger>
        <PopoverContent
          className="mt-1 p-1"
          onOpenAutoFocus={(evt) => evt.preventDefault()}
        >
          {text.length > 2 ? (
            suggestions ? (
              suggestions.length > 0 ? (
                suggestions.map((profile) => (
                  <Link
                    href={`/did/${profile.did}`}
                    prefetch={false}
                    key={profile.did}
                    className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-slate-100"
                  >
                    <img
                      src={profile.avatar?.replace(
                        "avatar",
                        "avatar_thumbnail",
                      )}
                      alt={profile.handle}
                      className="size-6 rounded-full bg-slate-50 text-transparent"
                    />
                    <p className="line-clamp-1 text-sm">@{profile.handle}</p>
                  </Link>
                ))
              ) : (
                <p className="mx-auto my-4 text-center text-sm">
                  No users found
                </p>
              )
            ) : (
              <Loader2Icon className="mx-auto my-4 animate-spin" size={16} />
            )
          ) : (
            <p className="mx-auto my-4 text-center text-sm">Keep typing...</p>
          )}
        </PopoverContent>
      </Popover>
      <Button
        type="submit"
        variant="secondary"
        disabled={pending}
        className="text-base"
      >
        Resolve
        {pending && <Loader2Icon className="ml-2 animate-spin" size={16} />}
      </Button>
    </>
  );
};
