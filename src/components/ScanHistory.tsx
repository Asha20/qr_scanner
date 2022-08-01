import { Result } from "~/components/Result";
import { ScanEntry } from "~/logic/store";

export interface ScanHistoryProps {
  entries: ScanEntry[];
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return hours + ":" + minutes;
}

export function ScanHistory({ entries }: ScanHistoryProps) {
  return (
    <table className="w-full x-table border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="flex-none border-y border-l w-16">Time</th>
          <th className="flex-auto border-y border-x">Content</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(({ created, value }) => (
          <tr key={created} className="odd:bg-white even:bg-blue-100">
            <td className="flex-none w-16 border-y border-l text-center">
              {formatTimestamp(created)}
            </td>
            <td className="truncate flex-auto flex border-y border-x">
              <Result value={value} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
