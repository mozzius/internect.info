"use client";

import { Loader2Icon } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { resolveHandle } from "./actions";

export const Form = () => {
  const [error, action] = useFormState(resolveHandle, undefined);

  return (
    <form className="w-full space-y-2" action={action}>
      <div className="flex-1 flex items-center space-x-2">
        <Fields />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

const Fields = () => {
  const { pending } = useFormStatus();

  return (
    <>
      <Input
        name="handle"
        type="text"
        placeholder="alice.bsky.social"
        required
        disabled={pending}
      />
      <Button type="submit" variant="secondary" disabled={pending}>
        Resolve
        {pending && <Loader2Icon className="ml-2 animate-spin" size={16} />}
      </Button>
    </>
  );
};
