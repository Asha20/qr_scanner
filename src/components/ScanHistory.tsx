import ClipboardCopyIcon from "@heroicons/react/solid/ClipboardCopyIcon";
import TrashIcon from "@heroicons/react/solid/TrashIcon";
import { DateTime } from "~/components/DateTime";
import { Result } from "~/components/Result";
import { copyToClipboard } from "~/logic/clipboard";
import { ScanEntry } from "~/logic/store";

export interface ScanHistoryProps {
  className?: string;
  entries: ScanEntry[];
  onDeleteEntry(timestamp: number): void;
}

export function ScanHistory({
  className = "",
  entries,
  onDeleteEntry,
}: ScanHistoryProps) {
  return (
    <ol className={`space-y-2 ${className}`}>
      {entries.map(({ created, value }) => (
        <li key={created} className="flex space-x-3">
          <button
            className="bg-danger flex-none rounded-md p-3"
            onClick={() => onDeleteEntry(created)}
          >
            <TrashIcon
              className="w-5 h-5 text-white"
              aria-label="Delete scan entry"
            />
          </button>

          <button
            className="bg-neutral flex-none rounded-md p-3"
            onClick={() => copyToClipboard(value)}
          >
            <ClipboardCopyIcon
              className="w-5 h-5 text-white"
              aria-label="Copy entry to clipboard"
            />
          </button>

          <div className="truncate">
            <Result className="text-white" value={value} />
            <em className="text-stone-300 text-sm">
              at <DateTime timestamp={created} />
            </em>
          </div>
        </li>
      ))}
    </ol>
  );
}
