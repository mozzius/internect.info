import Link from "next/link";
import { ArrowLeftIcon, AtSignIcon } from "lucide-react";

import { Footer } from "~/components/footer";
import { Button } from "~/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <main className="container mx-auto max-w-4xl flex-1 px-4 py-8 md:py-12">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <AtSignIcon className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-medium">internect.info</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeftIcon className="mr-2 size-4" />
              Back to search
            </Link>
          </Button>
        </div>

        {children}
      </main>
      <Footer />
    </div>
  );
}
