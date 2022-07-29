import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { assert } from "~/util/assert";
import * as logger from "~/util/logger";

export interface CameraProps {
  mediaStream: MediaStream;
}

export const Camera = forwardRef<HTMLVideoElement, CameraProps>(function Camera(
  { mediaStream },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [disabled, setDisabled] = useState(false);

  useImperativeHandle(ref, () => {
    assert(videoRef.current);
    return videoRef.current;
  });

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    async function initialize(video: HTMLVideoElement) {
      try {
        video.srcObject = mediaStream;
        video.setAttribute("playsinline", "true");
        await video.play();
        setDisabled(false);
      } catch (error) {
        // User refused
        assert(error instanceof Error);
        logger.error(error.toString());
        setDisabled(true);
      }
    }

    initialize(video);

    return () => video.pause();
  }, [mediaStream]);

  return (
    <div className={`w-full h-full ${disabled ? "bg-black" : ""}`}>
      <video
        ref={videoRef}
        className={`bg-black w-full h-full ${disabled ? "hidden" : ""}`}
      />

      {disabled && (
        <p className="text-white flex items-center justify-center h-full">
          Camera has been disabled.
        </p>
      )}
    </div>
  );
});
