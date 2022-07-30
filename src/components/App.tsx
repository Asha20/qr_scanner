import { useEffect, useRef, useState } from "react";
import { Camera } from "~/components/Camera";
import { useAsyncConst, useConst } from "~/hooks/useConst";
import { useInterval } from "~/hooks/useInterval";
import { Camera as xCamera } from "~/logic/camera";
import * as QrScanner from "~/logic/qr_scanner";
import * as logger from "~/util/logger";

const SCAN_ATTEMPTS_PER_SECOND = 10;

export function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [torch, setTorch] = useState(false);
  const camera = useConst(() =>
    xCamera({
      facingMode: "environment",
      width: { ideal: 720 },
      height: { ideal: 480 },
    }),
  );

  const { value: cameraStart, error: mediaError } = useAsyncConst(camera.start);

  const scanning = useRef(false);

  function updateTorch(value: boolean) {
    setTorch(value);
    camera.setTorch(value);
  }

  async function attemptScan() {
    if (!videoRef.current || scanning.current) {
      return;
    }

    scanning.current = true;
    const result = await QrScanner.scanVideo(videoRef.current);
    if (result.success) {
      alert(result.value);
    }
    scanning.current = false;
  }

  useInterval(attemptScan, 1000 / SCAN_ATTEMPTS_PER_SECOND);

  useEffect(() => {
    if (mediaError) {
      logger.error(mediaError);
    }
  }, [mediaError]);

  return (
    <div className="w-screen h-screen">
      <Camera
        ref={videoRef}
        mediaStream={cameraStart?.media}
        torch={
          cameraStart?.supportsTorch
            ? { active: torch, onChange: updateTorch }
            : null
        }
      />
    </div>
  );
}
