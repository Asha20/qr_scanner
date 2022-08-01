import React from "react";
import { Link, LinkProps, To } from "react-router-dom";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  kind: keyof typeof colorClasses;
}

export interface LinkButtonProps extends LinkProps {
  to: To;
  kind: keyof typeof colorClasses;
}

const colorClasses = {
  primary: "bg-primary disabled:bg-primary-disabled",
  danger: "bg-danger disabled:bg-danger-disabled",
  neutral: "bg-neutral disabled:bg-neutral-disabled",
} as const;

export function Button({ kind, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`text-white px-8 py-2 rounded text-xl ${colorClasses[kind]} ${className}`}
      {...props}
    />
  );
}

export function LinkButton({
  kind,
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={`text-white px-8 py-2 rounded text-xl text-center ${colorClasses[kind]} ${className}`}
      {...props}
    />
  );
}
