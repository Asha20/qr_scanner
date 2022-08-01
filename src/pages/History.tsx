import { ScanHistory } from "~/components/ScanHistory";
import { useStore } from "~/logic/store";

export function History() {
  const scanHistory = useStore(state => state.scanHistory);

  return (
    <div className="w-screen h-screen p-4">
      <ScanHistory entries={scanHistory} />
    </div>
  );
}
