export interface ResultProps {
  className?: string;
  value: string;
}

export function Result({ className = "", value }: ResultProps) {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new TypeError();
    }

    return (
      <a
        href={url.href}
        className={`text-blue-400 underline truncate block ${className}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {value}
      </a>
    );
  } catch {
    return <span className={`truncate block ${className}`}>{value}</span>;
  }
}
