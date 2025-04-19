import { AtSignIcon } from "lucide-react";

import { AnimatedBlob } from "~/components/animated-blob";
import { ExampleCard } from "~/components/example-card";
import { Footer } from "~/components/footer";
import { Search } from "~/components/search";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center">
        <div className="container flex flex-col items-center justify-center px-4 py-16 md:py-24 lg:py-32">
          <div className="mb-4 flex items-center space-x-2">
            <AtSignIcon className="size-8 text-blue-500" />
            <h1 className="text-xl font-medium">internect.info</h1>
          </div>

          <div className="mb-8 text-center">
            <h2 className="relative mb-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Explore the{" "}
              <span className="relative inline-block px-2">
                <span className="relative z-10 text-blue-500">ATmosphere</span>
                <AnimatedBlob className="scale-125" />
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Search for anything<sup>*</sup> on the AT Protocol
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <Search error={error} />
          </div>

          <p className="text-muted-foreground mt-16 text-xs">
            <sup>*</sup>and by anything, I just mean looking up handles. More
            stuff soon!
          </p>

          {/* <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ExampleCard
              title="Handle"
              example="alice.bsky.social"
              description="Look up a user by their Bluesky handle"
            />
            <ExampleCard
              title="DID"
              example="did:plc:6tm5ojdr5sgjfo5pqgn7szrk"
              description="Resolve a decentralized identifier"
            />
            <ExampleCard
              title="AT URI"
              example="at://mozzius.dev"
              description="Extract information from Bluesky URLs"
            />
          </div> */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
