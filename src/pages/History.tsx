import { Result } from "~/components/Result";
import { useStore } from "~/logic/store";

export function History() {
  const scanHistory = useStore(state => state.scanHistory);

  return (
    <ul>
      {scanHistory.map(scan => (
        <li key={scan}>
          <Result value={scan} />
        </li>
      ))}
    </ul>
  );
}
