import LightningBoltIconOutline from "@heroicons/react/outline/LightningBoltIcon";
import ViewListIcon from "@heroicons/react/outline/ViewListIcon";
import LightningBoltIconSolid from "@heroicons/react/solid/LightningBoltIcon";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "~/components/Button";
import { QrScanner, ScanResult } from "~/components/QrScanner/index";
import { Result } from "~/components/Result";
import { useAsyncConst } from "~/hooks/useConst";
import { Camera } from "~/logic/camera";
import { useStore } from "~/logic/store";

const SCAN_ATTEMPTS_PER_SECOND = 10;

interface OverlayProps {
  text: string;
  duplicate: boolean;
  onDismiss(accept: boolean): void;
}

function Overlay({ text, duplicate, onDismiss }: OverlayProps) {
  return (
    <div className="absolute inset-0 p-8 flex flex-col justify-center items-center gap-4 bg-black/80 select-none">
      <p className="w-full truncate text-white text-center text-lg">
        <Result value={text} />
      </p>

      <Button kind="primary" className="w-full" onClick={() => onDismiss(true)}>
        Save to history
      </Button>

      <Button kind="danger" className="w-full" onClick={() => onDismiss(false)}>
        Dismiss
      </Button>

      {duplicate ? (
        <p className="w-full text-stone-300 text-center text-lg">
          Note: This entry is already present in your scan history.
        </p>
      ) : null}
    </div>
  );
}

interface ControlsProps {
  scanCount: number;
  torch: { active: boolean; onChange(): void } | undefined;
}

function Controls({ torch, scanCount }: ControlsProps) {
  const LightningBoltIcon = torch?.active
    ? LightningBoltIconSolid
    : LightningBoltIconOutline;

  return (
    <div
      className={`absolute top-0 left-0 right-0 p-2 flex ${
        torch ? "justify-between" : "justify-end"
      }`}
    >
      {torch && (
        <button onClick={torch.onChange}>
          <LightningBoltIcon
            className="x-icon"
            aria-label={torch.active ? "Disable torch" : "Enable torch"}
          />
        </button>
      )}

      <Link to="/history" className="relative">
        <ViewListIcon className="x-icon" aria-label="Open scan history" />
        {scanCount > 0 && (
          <span
            className="w-5 h-5 grid bg-danger text-white rounded-full text-xs place-items-center absolute top-0 right-0 select-none"
            aria-label="Number of scans"
          >
            {scanCount}
          </span>
        )}
      </Link>
    </div>
  );
}

export function Scan() {
  const { value: camera } = useAsyncConst(
    () =>
      Camera({
        facingMode: "environment",
        width: { min: 720, ideal: 1280 },
        height: { min: 480, ideal: 720 },
        torch,
      }),
    x => {
      if (x.state === "resolved") {
        x.value.stop();
      }
    },
  );

  const [text, setText] = useState("");
  const [torch, setTorch] = useStore(state => [
    state.torch.value,
    state.torch.set,
  ]);
  const [scanHistory, addScan] = useStore(state => [
    state.scan.history,
    state.scan.add,
  ]);

  function onScan(result: ScanResult) {
    const newValue = result.success ? result.value : "";
    if (newValue !== text) {
      setText(newValue);
    }
  }

  useEffect(() => {
    camera?.setTorch(torch);
  }, [torch, camera]);

  function dismissOverlay(saveEntry: boolean) {
    if (saveEntry) {
      addScan(text);
    }
    setText("");
  }

  const duplicate = useMemo(
    () => text !== "" && scanHistory.some(entry => entry.value === text),
    [text, scanHistory],
  );

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <QrScanner
        scan={text === ""}
        onScan={onScan}
        attemptsPerSecond={SCAN_ATTEMPTS_PER_SECOND}
        media={camera?.mediaStream}
        messages={{
          noMedia: "Camera access permission is required.",
          notPlaying: "Loading...",
          inactive: "Camera feed is paused.",
        }}
      />

      {text && (
        <Overlay text={text} duplicate={duplicate} onDismiss={dismissOverlay} />
      )}

      <Controls
        scanCount={scanHistory.length}
        torch={
          camera?.supportsTorch
            ? { active: torch, onChange: () => setTorch(!torch) }
            : undefined
        }
      />
    </div>
  );
}
