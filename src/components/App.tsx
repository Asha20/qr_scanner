import { LightningBoltIcon as LightningBoltIconOutline } from "@heroicons/react/outline";
import { LightningBoltIcon as LightningBoltIconSolid } from "@heroicons/react/solid";
import { useState } from "react";
import { QrScanner, ScanResult } from "~/components/QrScanner/index";
import { Result } from "~/components/Result";
import { useAsyncConst } from "~/hooks/useConst";
import { Camera } from "~/logic/camera";

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
  torch: { active: boolean; onChange(): void } | undefined;
}

function Controls({ torch }: ControlsProps) {
  const LightningBoltIcon = torch?.active
    ? LightningBoltIconSolid
    : LightningBoltIconOutline;

  return (
    <div className="controls absolute top-0 left-0 right-0 p-2">
      {torch && (
        <button onClick={torch.onChange}>
          <LightningBoltIcon className="w-12 h-12 p-2 text-white rounded-full bg-gray-800/50" />
        </button>
      )}
    </div>
  );
}

export function App() {
  const { value: camera } = useAsyncConst(() =>
    Camera({
      facingMode: "environment",
      width: { min: 720, ideal: 1280 },
      height: { min: 480, ideal: 720 },
    }),
  );

  const [torch, setTorch] = useState(false);
  const [text, setText] = useState("");

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
        torch={
          camera?.supportsTorch
            ? { active: torch, onChange: toggleTorch }
            : undefined
        }
      />
    </div>
  );
}
