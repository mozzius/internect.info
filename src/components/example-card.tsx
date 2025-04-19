"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface ExampleCardProps {
  title: string;
  example: string;
  description: string;
}

export function ExampleCard({ title, example, description }: ExampleCardProps) {
  return (
    <Card className="gap-5 overflow-hidden pt-0">
      <CardHeader className="bg-muted/50 pt-5 pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 border-muted/70 mb-2 rounded border p-2 font-mono text-sm">
          {example}
        </div>
        <CardDescription>{description}</CardDescription>
        <Button variant="link" className="mt-2 h-auto p-0 text-blue-500">
          Try this example
        </Button>
      </CardContent>
    </Card>
  );
}
