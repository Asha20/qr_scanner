export interface ResultProps {
  value: string;
}

export function Result({ value }: ResultProps) {
  if (value.startsWith("http")) {
    return (
      <a
        href={value}
        className="text-blue-500 underline truncate block"
        target="_blank"
        rel="noopener noreferrer"
      >
        {value}
      </a>
    );
  }

  return <span className="truncate block">{value}</span>;
}
