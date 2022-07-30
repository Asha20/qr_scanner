import { LightningBoltIcon as LightningBoltIconOutline } from "@heroicons/react/outline";
import { LightningBoltIcon as LightningBoltIconSolid } from "@heroicons/react/solid";
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
  mediaStream?: MediaStream;
  onUpdateTorch(torch: boolean): void;
}

export const Camera = forwardRef<HTMLVideoElement, CameraProps>(function Camera(
  { mediaStream, onUpdateTorch },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [torch, setTorch] = useState(false);

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
      if (!mediaStream) {
        setDisabled(true);
        return;
      }

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

  const LightningBoltIcon = torch
    ? LightningBoltIconSolid
    : LightningBoltIconOutline;

  function toggleTorch() {
    setTorch(x => !x);
    onUpdateTorch(!torch);
  }

  return (
    <div className={`w-full h-full relative ${disabled ? "bg-black" : ""}`}>
      {disabled && (
        <p className="flex items-center justify-center text-white h-full">
          Camera has been disabled.
        </p>
      )}

      <video
        ref={videoRef}
        className={`bg-black w-full h-full ${disabled ? "hidden" : ""}`}
      />

      <div className="controls absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black">
        <button onClick={toggleTorch}>
          <LightningBoltIcon className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
});
