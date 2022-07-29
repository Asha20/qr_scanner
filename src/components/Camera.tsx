import { useLayoutEffect, useRef } from "react";
import { Camera as xCamera } from "~/logic/camera";
import { assert } from "~/util/assert";
import * as logger from "~/util/logger";

export interface CameraProps {
  width: number;
  height: number;
}

export function Camera(props: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef(
    xCamera({
      torch: false,
      constraints: {
        video: {
          facingMode: "environment",
          width: { ideal: props.width },
          height: { ideal: props.height },
        },
      },
    }),
  );

  useLayoutEffect(() => {
    async function initialize() {
      let stream: MediaStream;
      try {
        stream = await cameraRef.current.start();
      } catch (error) {
        // No permission to access camera
        assert(error instanceof Error);
        logger.error(error.toString());
        return;
      }

      const video = videoRef.current;
      assert(video);

      try {
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        await video.play();
      } catch (error) {
        // User refused
        assert(error instanceof Error);
        logger.error(error.toString());
      }
    }

    initialize();
  });

  return <video ref={videoRef}></video>;
}
