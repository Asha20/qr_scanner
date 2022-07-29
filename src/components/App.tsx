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

  const media = useAsyncConst(camera.start);

  useEffect(() => {
    if (media.state === "rejected") {
      logger.error(media.error);
    }
  }, [media]);

  return (
    <div className="w-screen h-screen">
      {media.state === "resolved" && (
        <Camera ref={videoRef} mediaStream={media.value} />
      )}
    </div>
  );
}
