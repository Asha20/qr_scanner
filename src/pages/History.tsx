import React from "react";
import { Button, LinkButton } from "~/components/Button";
import { ScanHistory } from "~/components/ScanHistory";
import { useStore } from "~/logic/store";

function Show({ when, children }: React.PropsWithChildren<{ when: boolean }>) {
  return when ? <>{children}</> : <div className="invisible">{children}</div>;
}

export function History() {
  const scan = useStore(state => state.scan);
  const hasHistory = scan.history.length > 0;

  return (
    <div className="w-screen h-screen p-4 flex flex-col justify-between">
      <Show when={hasHistory}>
        <ScanHistory
          className="overflow-y-scroll"
          entries={scan.history}
          onDeleteEntry={scan.delete}
        />
      </Show>

      <div className="flex flex-col space-y-3 mt-6">
        {hasHistory && (
          <>
            <Button kind="danger" disabled={!hasHistory} onClick={scan.clear}>
              Clear history
            </Button>

            {hasHistory ? (
              <LinkButton to="/export" kind="neutral">
                Export history
              </LinkButton>
            ) : (
              <Button kind="neutral" disabled={true}>
                Export history
              </Button>
            )}
          </>
        )}

        <LinkButton to="/" kind="primary">
          Go back
        </LinkButton>
      </div>
    </div>
  );
}
