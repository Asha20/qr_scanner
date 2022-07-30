import { LightningBoltIcon as LightningBoltIconOutline } from "@heroicons/react/outline";
import { LightningBoltIcon as LightningBoltIconSolid } from "@heroicons/react/solid";
import {
  forwardRef,
  useEffect,
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

type VideoState = "none" | "loading" | "playing";

export const Camera = forwardRef<HTMLVideoElement, CameraProps>(function Camera(
  { mediaStream, onUpdateTorch },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [torch, setTorch] = useState(false);
  const [playing, setPlaying] = useState(false);
  const state = useRef<VideoState>("none");

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
      console.info("init", mediaStream, state.current);

      if (state.current === "playing") {
        video.pause();
        state.current = "none";
      }

      if (!mediaStream) {
        return;
      }

      if (state.current !== "loading") {
        try {
          state.current = "loading";
          video.srcObject = mediaStream;
          await video.play();
          state.current = "playing";
        } catch (error) {
          // User refused
          assert(error instanceof Error);
          logger.error(error.toString());
          state.current = "none";
        }
      }
    }

    initialize(video);

    return () => {
      console.info("delet", mediaStream, state.current);
      if (state.current === "playing") {
        video.pause();
        state.current = "none";
      }
    };
  }, [mediaStream]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPlaying(state.current === "playing");
  });

  const LightningBoltIcon = torch
    ? LightningBoltIconSolid
    : LightningBoltIconOutline;

  function toggleTorch() {
    setTorch(x => !x);
    onUpdateTorch(!torch);
  }

  const hideVideo = !playing || Boolean(!mediaStream);

  return (
    <div className={`w-full h-full relative ${hideVideo ? "bg-black" : ""}`}>
      {hideVideo && (
        <p className="flex items-center justify-center text-white h-full select-none">
          {!mediaStream ? "No media stream." : "Not playing."}
        </p>
      )}

      <video
        ref={videoRef}
        className={`bg-black w-full h-full ${hideVideo ? "hidden" : ""}`}
        playsInline={true}
      />

      <div className="controls absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black">
        <button onClick={toggleTorch}>
          <LightningBoltIcon className="w-12 h-12 p-2 text-white" />
        </button>
      </div>
    </div>
  );
});
