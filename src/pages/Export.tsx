import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";
import ClipboardCopyIcon from "@heroicons/react/solid/ClipboardCopyIcon";
import DownloadIcon from "@heroicons/react/solid/DownloadIcon";
import { IconButton, LinkIconButton } from "~/components/Button";
import { copyToClipboard } from "~/logic/clipboard";
import { downloadString } from "~/logic/download";
import { useStore } from "~/logic/store";

export function Export() {
  const scanHistory = useStore(state => state.scan.history);

  function historyText() {
    return scanHistory.map(x => x.value).join("\n");
  }

  async function exportToClipboard() {
    copyToClipboard(historyText());
  }

  async function exportToFile() {
    downloadString("history.txt", historyText());
  }

  return (
    <div className="w-screen h-screen flex flex-col space-y-3 p-4 justify-end text-center">
      <IconButton
        kind="neutral"
        icon={<DownloadIcon className="w-5 h-5" aria-hidden />}
        onClick={exportToFile}
      >
        Download as file
      </IconButton>

      <IconButton
        kind="neutral"
        icon={<ClipboardCopyIcon className="w-5 h-5" aria-hidden />}
        onClick={exportToClipboard}
      >
        Copy to clipboard
      </IconButton>

      <LinkIconButton
        to="/history"
        kind="primary"
        icon={<ArrowLeftIcon className="w-5 h-5" aria-hidden />}
      >
        Go back
      </LinkIconButton>
    </div>
  );
}
