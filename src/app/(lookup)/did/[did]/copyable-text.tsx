"use client";

import { useEffect, useState } from "react";
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";
import { toast } from "sonner";

export const CopyableText = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const Icon = copied ? ClipboardCheckIcon : ClipboardIcon;

  return (
    <span
      className="group inline-flex cursor-pointer flex-wrap items-center gap-px hover:underline"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast("Copied to clipboard!");
      }}
    >
      {text}
      <Icon className="ml-1" size={14} />
    </span>
  );
};
