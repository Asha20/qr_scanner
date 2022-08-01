import React from "react";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  kind: keyof typeof colorClasses;
}

const colorClasses = {
  primary: "bg-primary disabled:bg-primary-disabled",
  danger: "bg-danger disabled:bg-danger-disabled",
} as const;

export function Button({ kind, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`text-white px-8 py-2 rounded text-xl ${colorClasses[kind]} ${className}`}
      {...props}
    />
  );
}
