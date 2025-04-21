import { SiBluesky as BlueskyIcon } from "@icons-pack/react-simple-icons";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { CardDescription, CardTitle } from "~/components/ui/card";
import { agent } from "~/lib/agent";

export async function BlueskyInfo({ did }: { did: string }) {
  const profile = await agent.getProfile({ actor: did }).catch((err) => {
    if (err instanceof Error && err.message.includes("deactivated")) {
      return "DEACTIVATED" as const;
    } else {
      return "NON-BSKY" as const;
    }
  });

  return profile === "DEACTIVATED" ? (
    <CardTitle className="text-2xl">Deactivated Account</CardTitle>
  ) : profile === "NON-BSKY" ? (
    <CardTitle className="text-2xl">Non-Bluesky Identity</CardTitle>
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
      <Badge variant="outline" className="ml-auto flex items-center gap-1.5">
        <BlueskyIcon className="size-3" />
        <span>Bluesky</span>
      </Badge>
    </div>
  );
}

export function BlueskyInfoFallback() {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10 outline-1 outline-neutral-200" />
      <div>
        <div className="bg-muted h-4 w-16" />
        <div className="bg-muted h-3 w-12" />
      </div>
    </div>
  );
}
