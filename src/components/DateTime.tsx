import React from "react";

export interface DateTimeProps {
  className?: string;
  timestamp: number;
}
function formatTimestamp(timestamp: number, dateTimeSeparator: string) {
  const date = new Date(timestamp);

  const year = date.getFullYear().toString();
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}${dateTimeSeparator}${hours}:${minutes}`;
}

export function DateTime({
  className,
  timestamp,
  children,
}: React.PropsWithChildren<DateTimeProps>) {
  return (
    <time className={className} dateTime={formatTimestamp(timestamp, "T")}>
      {children ?? formatTimestamp(timestamp, " ")}
    </time>
  );
}
