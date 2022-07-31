import { useState } from "react";
import { QrScanner, ScanResult } from "~/components/QrScanner/index";
import { useAsyncConst } from "~/hooks/useConst";
import { Camera } from "~/logic/camera";

const SCAN_ATTEMPTS_PER_SECOND = 10;

export function App() {
  const { value: camera } = useAsyncConst(() =>
    Camera({
      facingMode: "environment",
      width: { ideal: 720 },
      height: { ideal: 480 },
    }),
  );

  const [scanning, setScanning] = useState(false);
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

  return (
    <div className="w-screen h-screen relative">
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
      <div className="absolute bottom-0 left-0 right-0 text-center text-white p-4">
        <p>
          {text ? "Found code:" : scanning ? "Searching..." : "Not searching."}
        </p>
        <p className="min-h-[1.5rem] truncate">{text}</p>
      </div>
    </div>
  );
}
