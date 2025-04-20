"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AtUri } from "@atproto/syntax";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { agent } from "~/lib/agent";
import { cn } from "~/lib/utils";

const HANDLE_REGEX =
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

interface Props {
  error?: string;
}

export function Search({ error: initialError }: Props) {
  const [error, setError] = useState(initialError);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigation = useRouter();

  const { data: suggestions, isLoading } = useQuery({
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
    enabled: query.length > 2,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If suggestions exist and dropdown is open, select the first one
    if (open && suggestions && suggestions.length > 0 && !inputFocus) {
      handleSearch(suggestions[0].did);
    } else {
      handleSearch(query);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex h-12 items-center overflow-hidden rounded-lg border shadow-md">
            <SearchIcon className="text-muted-foreground absolute left-3 size-4" />
            <input
              type="text"
              placeholder="alice.bsky.social"
              className={cn(
                "h-12 w-full border-0 bg-transparent pr-24 pl-10 outline-none focus:outline-none focus-visible:ring-0",
                error && "text-red-500",
              )}
              value={query}
              onChange={(e) => {
                setError("");
                setQuery(e.target.value);
                setOpen(e.target.value.length > 0);
              }}
            />
            <Button
              ref={buttonRef}
              type="submit"
              className="absolute top-0 right-0 h-12 rounded-l-none rounded-r-lg px-6"
            >
              Explore
            </Button>
          </div>
        </form>

        {open && query && query.length > 2 && (
          <div className="bg-popover absolute top-full right-0 left-0 z-50 mt-1 max-h-[300px] overflow-hidden rounded-md border shadow-md">
            <Command className="w-full" shouldFilter={false}>
              <CommandList className="max-h-[300px] w-full overflow-auto">
                {isLoading ? (
                  <CommandEmpty className="flex py-4">
                    <span className="text-muted-foreground flex-1 text-center text-sm italic">
                      Loading...
                    </span>
                  </CommandEmpty>
                ) : suggestions && suggestions.length > 0 ? (
                  <>
                    <CommandGroup heading="Suggestions">
                      {suggestions.map((actor) => (
                        <CommandItem
                          key={actor.did}
                          onSelect={() => handleSearch(actor.did)}
                          value={actor.did}
                          className="px-3 py-2"
                        >
                          <div className="flex items-center">
                            {actor.avatar && (
                              <img
                                src={actor.avatar}
                                alt={actor.displayName || actor.handle}
                                className="mr-2 h-8 w-8 rounded-full"
                              />
                            )}
                            <div className="flex flex-col">
                              {actor.displayName && (
                                <span className="font-medium">
                                  {actor.displayName}
                                </span>
                              )}
                              <span className="text-muted-foreground text-sm">
                                @{actor.handle}
                              </span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                ) : (
                  <CommandEmpty className="flex py-4">
                    <span className="text-muted-foreground flex-1 text-center text-sm italic">
                      No suggestions found.
                    </span>
                  </CommandEmpty>
                )}
              </CommandList>
            </Command>
          </div>
        )}
      </div>

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
