import {
  LightningBoltIcon as LightningBoltIconOutline,
  ViewListIcon,
} from "@heroicons/react/outline";
import { LightningBoltIcon as LightningBoltIconSolid } from "@heroicons/react/solid";
import { useState } from "react";
import { Link } from "react-router-dom";
import { QrScanner, ScanResult } from "~/components/QrScanner/index";
import { Result } from "~/components/Result";
import { useAsyncConst } from "~/hooks/useConst";
import { Camera } from "~/logic/camera";
import { useStore } from "~/logic/store";

const SCAN_ATTEMPTS_PER_SECOND = 10;

interface OverlayProps {
  text: string;
  onScanAnother(): void;
}

function Overlay({ text, onScanAnother }: OverlayProps) {
  return (
    <div className="absolute inset-0 p-8 flex flex-col justify-end items-center gap-4 bg-black/80 select-none">
      <p className="w-full truncate text-white text-center text-lg">
        <Result value={text} />
      </p>

      <button
        className="text-white bg-blue-300 px-8 py-4 rounded text-xl"
        onClick={onScanAnother}
      >
        Scan another
      </button>
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
            className="w-5 h-5 grid bg-red-400 text-white rounded-full text-xs place-items-center absolute top-0 right-0 select-none"
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
      }),
    x => {
      if (x.state === "resolved") {
        x.value.stop();
      }
    },
  );

  const [torch, setTorch] = useState(false);
  const [text, setText] = useState("");
  const scanHistory = useStore(state => state.scanHistory);
  const addScan = useStore(state => state.addScan);

  function toggleTorch() {
    if (camera) {
      setTorch(!torch);
      camera.setTorch(!torch);
    }
  }

  function onScan(result: ScanResult) {
    const newValue = result.success ? result.value : "";
    if (newValue !== text) {
      setText(newValue);
      addScan(newValue);
    }
  }

  function scanAnother() {
    setText("");
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <QrScanner
        scan={text === ""}
        onScan={onScan}
        attemptsPerSecond={SCAN_ATTEMPTS_PER_SECOND}
        media={camera?.mediaStream}
      />

      {text && <Overlay text={text} onScanAnother={scanAnother} />}

      <Controls
        scanCount={scanHistory.length}
        torch={
          camera?.supportsTorch
            ? { active: torch, onChange: toggleTorch }
            : undefined
        }
      />
    </div>
  );
}
