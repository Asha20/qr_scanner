import React from "react";
import { Link, LinkProps, To } from "react-router-dom";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  kind: keyof typeof colorClasses;
}

export interface IconButtonProps extends ButtonProps {
  className?: string;
  icon: React.ReactElement;
}

export interface LinkButtonProps extends LinkProps {
  to: To;
  kind: keyof typeof colorClasses;
}

export interface LinkIconButtonProps extends LinkButtonProps {
  className?: string;
  icon: React.ReactElement;
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

export function IconButton({
  icon,
  className = "",
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      className={`flex justify-between items-center ${className}`}
      {...props}
    >
      {icon}
      <div className="flex-1">{children}</div>
    </Button>
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

export function LinkIconButton({
  icon,
  className = "",
  children,
  ...props
}: LinkIconButtonProps) {
  return (
    <LinkButton
      className={`flex justify-between items-center ${className}`}
      {...props}
    >
      {icon}
      <div className="flex-1">{children}</div>
    </LinkButton>
  );
}
