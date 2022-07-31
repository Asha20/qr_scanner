import { useState } from "react";
import { QrScanner, ScanResult } from "~/components/QrScanner/index";
import { Result } from "~/components/Result";
import { useAsyncConst } from "~/hooks/useConst";
import { Camera } from "~/logic/camera";

const SCAN_ATTEMPTS_PER_SECOND = 10;

export function App() {
  const { value: camera } = useAsyncConst(() =>
    Camera({
      facingMode: "environment",
      width: { min: 720, ideal: 1280 },
      height: { min: 480, ideal: 720 },
    }),
  );

  const [scanning, setScanning] = useState(true);
  const [torch, setTorch] = useState(false);
  const [text, setText] = useState("");

  function updateTorch(value: boolean) {
    if (camera) {
      setTorch(value);
      camera.setTorch(value);
    }
  }

  function onScan(result: ScanResult) {
    const newValue = result.success ? result.value : "";
    if (newValue !== text) {
      setText(newValue);
      setScanning(false);
    }
  }

  function scanAnother() {
    setText("");
    setScanning(true);
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {!scanning && (
        <div className="absolute w-full h-full p-8 flex flex-col justify-end items-center bg-black/80 gap-4 z-10 select-none">
          <p className="w-full truncate text-white text-center text-lg">
            <Result value={text} />
          </p>

          <button
            className="text-white bg-blue-300 px-8 py-4 rounded text-xl"
            onClick={scanAnother}
          >
            Scan another
          </button>
        </div>
      )}

      <QrScanner
        scan={scanning}
        onScan={onScan}
        attemptsPerSecond={SCAN_ATTEMPTS_PER_SECOND}
        media={camera?.mediaStream}
        torch={
          camera?.supportsTorch
            ? { active: torch, onChange: updateTorch }
            : undefined
        }
      />
    </div>
  );
}
