import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { DateTime } from "./datetime";

export type AuditRecord = {
  did: string;
  operation:
    | {
        type: "create";
        signingKey: string;
        recoveryKey: string;
        handle: string;
        service: string;
        prev: string | null;
        sig: string;
      }
    | {
        type: "plc_operation";
        sig: string;
        prev: string;
        services: any;
        alsoKnownAs: string[];
        rotationKeys: string[];
        verificationMethods: {
          atproto: string;
        };
      }
    | {
        type: "plc_tombstone";
        sig: string;
        prev: string;
      };
  cid: string;
  nullified: boolean;
  createdAt: string;
};

export const HistoryDialog = ({ log }: { log: AuditRecord[] }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="ml-auto h-auto text-sm text-blue-500"
        >
          View history
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Audit log</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] w-full overflow-hidden">
          {log.map((record) => (
            <div
              key={record.cid}
              className={cn(
                "line-clamp-1 w-full border-b p-1 break-all last:border-b-0",
                record.nullified && "bg-red-100",
              )}
            >
              <p className="line-clamp-1 font-medium">
                {(() => {
                  switch (record.operation.type) {
                    case "create":
                      return `Created - ${record.operation.handle}`;
                    case "plc_operation":
                      return (
                        record.operation.alsoKnownAs
                          .map((x) => x.slice("at://".length))
                          .join(", ") || "Updated"
                      );
                    case "plc_tombstone":
                      return "Deleted";
                  }
                })()}
              </p>
              <DateTime
                date={new Date(record.createdAt)}
                className="line-clamp-1 text-sm text-slate-500"
              />
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
