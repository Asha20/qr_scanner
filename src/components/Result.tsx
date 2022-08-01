export interface ResultProps {
  className?: string;
  value: string;
}

export function Result({ className = "", value }: ResultProps) {
  if (value.startsWith("http")) {
    return (
      <a
        href={value}
        className={`text-blue-400 underline truncate block ${className}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {value}
      </a>
    );
  }

  return <span className={`truncate block ${className}`}>{value}</span>;
}
