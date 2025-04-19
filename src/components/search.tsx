"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AtUri } from "@atproto/syntax";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

const HANDLE_REGEX =
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

interface Props {
  error?: string;
}

export function Search({ error: initialError }: Props) {
  const [error, setError] = useState(initialError);
  const [query, setQuery] = useState("");
  const navigation = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let input = query.trim();
    if (input.startsWith("@")) {
      input = input.slice(1);
    }
    if (!input) return;

    if (input.startsWith("did:")) {
      navigation.push(`/did/${input}`);
    } else if (HANDLE_REGEX.test(input)) {
      navigation.push(`/handle/${input}`);
    } else if (input.startsWith("at://")) {
      try {
        const aturi = new AtUri(input);

        if (aturi.host && !aturi.collection) {
          if (aturi.host.startsWith("did:")) {
            navigation.push(`/did/${aturi.host}`);
          } else {
            navigation.push(`/handle/${aturi.host}`);
          }
        } else {
          setError("Record URIs are not yet supported.");
        }
      } catch (error) {
        setError("Invalid AT URI.");
      }
    } else if (input.startsWith("https://bsky.app/profile/")) {
      const [handleOrDid, ...rest] = query
        .slice("https://bsky.app/profile/".length)
        .split("/");
      if (rest.length === 0) {
        if (handleOrDid.startsWith("did:")) {
          navigation.push(`/did/${handleOrDid}`);
        } else {
          navigation.push(`/handle/${handleOrDid}`);
        }
      } else {
        setError("That Bluesky URL is not supported.");
      }
    } else {
      setError("Invalid input. Not sure what you're on about.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="alice.bsky.social"
          className={cn(
            "h-12 pr-24 pl-4 text-base shadow-sm",
            error && "border-red-500 ring-red-500",
          )}
          value={query}
          onChange={(e) => {
            setError("");
            setQuery(e.target.value);
          }}
        />
        <Button
          type="submit"
          className="absolute top-0 right-0 h-12 rounded-l-none px-6"
        >
          Resolve
        </Button>
      </div>
      {error ? (
        <div className="text-destructive-foreground mt-2 text-xs">{error}</div>
      ) : (
        <div className="text-muted-foreground mt-2 text-xs">
          Try searching for a handle, DID, or URL
        </div>
      )}
    </form>
  );
}
