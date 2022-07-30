import { useEffect, useRef } from "react";
import { Camera } from "~/components/Camera";
import { useAsyncConst, useConst } from "~/hooks/useConst";
import { useInterval } from "~/hooks/useInterval";
import { Camera as xCamera } from "~/logic/camera";
import * as QrScanner from "~/logic/qr_scanner";
import * as logger from "~/util/logger";

const SCAN_ATTEMPTS_PER_SECOND = 2;

export function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const camera = useConst(() =>
    xCamera({
      constraints: {
        video: {
          facingMode: "environment",
          width: { ideal: 1280, min: 720 },
          height: { ideal: 720, min: 480 },
        },
      },
      torch: false,
    }),
  );

  const { value: qrScanner } = useAsyncConst(QrScanner.init);
  const { value: media, error: mediaError } = useAsyncConst(camera.start);

  function updateTorch(torch: boolean) {
    camera.setTorch(torch);
  }

  function attemptScan() {
    if (!videoRef.current || !qrScanner) {
      return;
    }

    const result = qrScanner.scanVideo(videoRef.current);
    if (result.success) {
      alert(result.value);
    }
  }

  useInterval(attemptScan, 1000 / SCAN_ATTEMPTS_PER_SECOND);

  useEffect(() => {
    if (mediaError) {
      logger.error(mediaError);
    }
  }, [mediaError]);

  return (
    <div className="w-screen h-screen">
      <Camera ref={videoRef} mediaStream={media} onUpdateTorch={updateTorch} />
    </div>
  );
}
