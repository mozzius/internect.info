"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "../ui/button";

export function CopyButton({
  text,
  tooltip,
}: {
  text: string;
  tooltip: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <TooltipProvider>
      <Tooltip open={copied || undefined}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => {
              navigator.clipboard.writeText(text);
              setCopied(true);
            }}
          >
            <Icon className="size-4" />
            <span className="sr-only">{tooltip}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent key={copied ? "copied" : "tooltip"}>
          <p>{copied ? "Copied!" : tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
