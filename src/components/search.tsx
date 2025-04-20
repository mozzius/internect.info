"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AtUri } from "@atproto/syntax";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandLoading,
} from "~/components/ui/command";
import { agent } from "~/lib/agent";

const HANDLE_REGEX =
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

interface Props {
  error?: string;
}

export function Search({ error: initialError }: Props) {
  const [error, setError] = useState(initialError);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigation = useRouter();

  const { data: suggestions, isPending } = useQuery({
    queryKey: ["suggestions", query],
    queryFn: async () => {
      if (query.startsWith("did:")) {
        try {
          const { data } = await agent.getProfile({ actor: query });
          return [data];
        } catch (error) {
          return [];
        }
      } else {
        try {
          const { data } = await agent.searchActorsTypeahead({
            q: query,
            limit: 5,
          });
          return data.actors;
        } catch (error) {
          return [];
        }
      }
    },
    enabled: query.length > 1,
    placeholderData: keepPreviousData,
  });

  const handleSearch = (input: string) => {
    if (!input) return;

    setOpen(false);

    let searchInput = input.trim();
    if (searchInput.startsWith("@")) {
      searchInput = searchInput.slice(1);
    }

    if (searchInput.startsWith("did:")) {
      navigation.push(`/did/${searchInput}`);
    } else if (HANDLE_REGEX.test(searchInput)) {
      navigation.push(`/handle/${searchInput}`);
    } else if (searchInput.startsWith("at://")) {
      try {
        const aturi = new AtUri(searchInput);

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
    } else if (searchInput.startsWith("https://bsky.app/profile/")) {
      const [handleOrDid, ...rest] = searchInput
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
    <div className="relative w-full">
      <Command
        className="relative overflow-visible rounded-lg"
        shouldFilter={false}
        loop
      >
        <div className="relative flex h-12 items-center overflow-hidden rounded-lg border shadow-md">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 size-4" />
          <CommandPrimitive.Input
            placeholder="alice.bsky.social"
            className="h-12 w-full border-0 bg-transparent pr-24 pl-10 outline-none focus:outline-none focus-visible:ring-0 lg:text-sm"
            value={query}
            onValueChange={(value) => {
              setError("");
              setQuery(value);
              setOpen(value.length > 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (!open || !suggestions?.length)) {
                e.preventDefault();
                handleSearch(query);
              }
            }}
            autoFocus
            autoCapitalize="none"
            autoComplete="off"
          />
          <Button
            ref={buttonRef}
            className="absolute top-0 right-0 h-full rounded-l-none rounded-r-lg px-6"
            onClick={() => handleSearch(query)}
          >
            Explore
          </Button>
        </div>

        {open && query && query.length > 1 && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1">
            <CommandList className="bg-popover max-h-[350px] overflow-auto rounded-lg border shadow-md">
              {isPending ? (
                <CommandLoading className="text-muted-foreground italic">
                  Loading...
                </CommandLoading>
              ) : suggestions && suggestions.length > 0 ? (
                <CommandGroup heading="Suggestions">
                  {suggestions.map((actor) => (
                    <CommandItem
                      key={actor.did}
                      onSelect={() => handleSearch(actor.did)}
                      value={actor.did}
                      className="px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="outline-1 outline-neutral-200">
                          <AvatarImage
                            src={actor.avatar?.replace(
                              "/img/avatar/plain/",
                              "/img/avatar_thumbnail/plain/",
                            )}
                          />
                          <AvatarFallback>
                            {(actor.displayName || actor.handle)
                              .split(" ")
                              .map((word) => word.charAt(0))
                              .slice(0, 2)
                              .join("")
                              .toLocaleUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          {actor.displayName && (
                            <span className="text-sm font-semibold">
                              {actor.displayName}
                            </span>
                          )}
                          <span className="text-muted-foreground text-xs">
                            @{actor.handle}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty className="text-muted-foreground italic">
                  No suggestions found.
                </CommandEmpty>
              )}
            </CommandList>
          </div>
        )}
      </Command>

      {error ? (
        <div className="text-destructive-foreground mt-2 text-xs">{error}</div>
      ) : (
        <div className="text-muted-foreground mt-2 text-xs">
          Try searching for a handle, DID, or AT URI.
        </div>
      )}
    </div>
  );
}
