import React from "react";
import { Link } from "react-router-dom";
import { Button } from "~/components/Button";
import { ScanHistory } from "~/components/ScanHistory";
import { useStore } from "~/logic/store";

function Show({ when, children }: React.PropsWithChildren<{ when: boolean }>) {
  return when ? <>{children}</> : <div className="invisible">{children}</div>;
}

export function History() {
  const scan = useStore(state => state.scan);

  return (
    <div className="w-screen h-screen p-4 flex flex-col justify-between">
      <Show when={scan.history.length > 0}>
        <ScanHistory entries={scan.history} onDeleteEntry={scan.delete} />
      </Show>

      <div className="flex flex-col space-y-3">
        <Button
          kind="danger"
          disabled={scan.history.length === 0}
          onClick={scan.clear}
        >
          Clear history
        </Button>

        <Link
          to="/"
          className="text-white bg-primary px-8 py-2 rounded text-xl text-center"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
