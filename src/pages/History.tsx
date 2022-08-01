import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";
import DownloadIcon from "@heroicons/react/solid/DownloadIcon";
import TrashIcon from "@heroicons/react/solid/TrashIcon";
import { IconButton, LinkIconButton } from "~/components/Button";
import { ScanHistory } from "~/components/ScanHistory";
import { useStore } from "~/logic/store";

export function History() {
  const scan = useStore(state => state.scan);
  const hasHistory = scan.history.length > 0;

  return (
    <div className="w-screen h-screen p-4 flex flex-col justify-between">
      {hasHistory ? (
        <ScanHistory
          className="overflow-y-auto"
          entries={scan.history}
          onDeleteEntry={scan.delete}
        />
      ) : (
        <p className="flex-auto flex justify-center items-center text-2xl text-stone-500">
          No history entries yet.
        </p>
      )}

      <div className="flex flex-col space-y-3 mt-6">
        {hasHistory && (
          <>
            <IconButton
              kind="danger"
              className="text-center"
              icon={<TrashIcon className="w-5 h-5" aria-hidden />}
              disabled={!hasHistory}
              onClick={scan.clear}
            >
              Clear history
            </IconButton>

            {hasHistory ? (
              <LinkIconButton
                to="/export"
                kind="neutral"
                icon={<DownloadIcon className="w-5 h-5" aria-hidden />}
              >
                Export history
              </LinkIconButton>
            ) : (
              <IconButton
                kind="neutral"
                icon={<DownloadIcon className="w-5 h-5" aria-hidden />}
                disabled={true}
              >
                Export history
              </IconButton>
            )}
          </>
        )}

        <LinkIconButton
          to="/"
          kind="primary"
          icon={<ArrowLeftIcon className="w-5 h-5" aria-hidden />}
        >
          Go back
        </LinkIconButton>
      </div>
    </div>
  );
}
