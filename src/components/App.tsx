import { useState } from "react";
import { QrScanner } from "~/components/QrScanner";
import { useAsyncConst, useConst } from "~/hooks/useConst";
import { Camera } from "~/logic/camera";
import { ScanResult } from "~/logic/qr_scanner";

export function App() {
  const camera = useConst(() =>
    Camera({
      facingMode: "environment",
      width: { ideal: 720 },
      height: { ideal: 480 },
    }),
  );

  const { value: camFeed } = useAsyncConst(camera.start);

  const [torch, setTorch] = useState(false);

  function updateTorch(value: boolean) {
    setTorch(value);
    camera.setTorch(value);
  }

  function onScan(result: ScanResult) {
    console.log({ result });
  }

  return (
    <div className="w-screen h-screen flex">
      <div className="bg-red-300 flex-auto">
        <QrScanner
          media={camFeed?.media}
          torch={
            camFeed?.supportsTorch
              ? { active: torch, onChange: updateTorch }
              : undefined
          }
          onScan={onScan}
        />
      </div>
      <div className="bg-blue-300 flex-auto">
        <QrScanner
          media={camFeed?.media}
          torch={
            camFeed?.supportsTorch
              ? { active: torch, onChange: updateTorch }
              : undefined
          }
          onScan={onScan}
        />
      </div>
    </div>
  );
}
