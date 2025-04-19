"use client";

import { useMemo } from "react";

export const DateTime = ({
  date,
  className,
}: {
  date: Date;
  className?: string;
}) => {
  const intl = useMemo(
    () =>
      // uses locale from browser - thus suppressHydrationWarning
      new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    [],
  );
  return (
    <time
      dateTime={date.toISOString()}
      suppressHydrationWarning
      className={className}
    >
      {intl.format(date)}
    </time>
  );
};
