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

export type Torch = { active: boolean; onChange: (value: boolean) => void };

export interface CameraProps {
  mediaStream: MediaStream | undefined;
  torch: Torch | undefined;
}

type VideoState = "none" | "loading" | "playing";

export const MediaStreamPlayer = forwardRef<HTMLVideoElement, CameraProps>(
  ({ mediaStream, torch }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
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
        if (state.current === "playing") {
          video.pause();
          state.current = "none";
          setPlaying(false);
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
            setPlaying(true);
          } catch (error) {
            // User refused
            assert(error instanceof Error);
            logger.error(error.toString());
            state.current = "none";
            setPlaying(false);
          }
        }
      }

      initialize(video);

      return () => {
        if (state.current === "playing") {
          video.pause();
          state.current = "none";
        }
      };
    }, [mediaStream]);

    const LightningBoltIcon = torch?.active
      ? LightningBoltIconSolid
      : LightningBoltIconOutline;

    const hideVideo = !playing || Boolean(!mediaStream);

    return (
      <div
        className={`w-full h-full overflow-hidden relative ${
          hideVideo ? "bg-black" : ""
        }`}
      >
        {hideVideo && (
          <p className="flex items-center justify-center text-white h-full select-none">
            {!mediaStream ? "No media stream." : "Not playing."}
          </p>
        )}

        <video
          ref={videoRef}
          className={`w-full ${hideVideo ? "hidden" : ""}`}
          playsInline={true}
        />

        <div className="controls absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black">
          {torch && (
            <button onClick={() => torch.onChange(!torch.active)}>
              <LightningBoltIcon className="w-12 h-12 p-2 text-white" />
            </button>
          )}
        </div>
      </div>
    );
  },
);

MediaStreamPlayer.displayName = "MediaStreamPlayer";
