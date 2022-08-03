import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { assert } from "~/util/assert";
import * as logger from "~/util/logger";

export interface MediaStreamPlayerProps {
  active?: boolean;
  mediaStream: MediaStream | undefined;
  messages: {
    noMedia: string;
    notPlaying: string;
    inactive: string;
  };
}

type VideoState = "none" | "loading" | "playing";

export const MediaStreamPlayer = forwardRef<
  HTMLVideoElement,
  MediaStreamPlayerProps
>(({ active = true, mediaStream, messages }, ref) => {
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

  function displayStatusMessage() {
    if (!mediaStream) {
      return messages.noMedia;
    }
    if (!playing) {
      return messages.notPlaying;
    }
    if (!active) {
      return messages.inactive;
    }

    return "";
  }

  const statusMessage = displayStatusMessage();
  const hideVideo = Boolean(statusMessage);

  return (
    <div className="w-full h-full">
      {hideVideo && (
        <p className="flex items-center justify-center text-white h-full select-none">
          {statusMessage}
        </p>
      )}

      <video
        ref={videoRef}
        className={`w-full ${hideVideo ? "invisible" : ""}`}
        playsInline={true}
      />
    </div>
  );
});

MediaStreamPlayer.displayName = "MediaStreamPlayer";
