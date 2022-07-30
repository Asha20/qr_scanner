import { useEffect, useRef } from "react";
import { Camera } from "~/components/Camera";
import { useAsyncConst, useConst } from "~/hooks/useConst";
import { Camera as xCamera } from "~/logic/camera";
import * as logger from "~/util/logger";

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

  function updateTorch(torch: boolean) {
    camera.setTorch(torch);
  }

  const { value: media, error: mediaError } = useAsyncConst(camera.start);

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
