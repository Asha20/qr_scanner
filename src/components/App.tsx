import { useState } from "react";
import { QrScanner } from "~/components/QrScanner";
import { useAsyncConst } from "~/hooks/useConst";
import { Camera } from "~/logic/camera";
import { ScanResult } from "~/logic/qr_scanner";

export function App() {
  const { value: camera } = useAsyncConst(() =>
    Camera({
      facingMode: "environment",
      width: { ideal: 720 },
      height: { ideal: 480 },
    }),
  );

  const [torch, setTorch] = useState(false);

  function updateTorch(value: boolean) {
    if (camera) {
      setTorch(value);
      camera.setTorch(value);
    }
  }

  function onScan(result: ScanResult) {
    console.log({ result });
    if (result.success) {
      alert(JSON.stringify(result));
    }
  }

  return (
    <div className="w-screen h-screen flex">
      <div className="bg-red-300 flex-auto">
        <QrScanner
          scan={true}
          media={camera?.mediaStream}
          torch={
            camera?.supportsTorch
              ? { active: torch, onChange: updateTorch }
              : undefined
          }
          onScan={onScan}
        />
      </div>
    </div>
  );
}
