import { useRef } from "react";
import {
  MediaStreamPlayer,
  MediaStreamPlayerProps,
} from "~/components/MediaStreamPlayer";
import { useInterval } from "~/hooks/useInterval";
import * as xQrScanner from "./qr_scanner";

export interface QrScannerProps {
  showVideo?: boolean;
  media: MediaStream | undefined;
  scan: boolean;
  attemptsPerSecond: number;
  messages: MediaStreamPlayerProps["messages"];
  onScan(result: xQrScanner.ScanResult): void;
}

export function QrScanner({
  showVideo,
  media,
  scan,
  attemptsPerSecond,
  messages,
  onScan,
}: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanning = useRef(false);

  async function attemptScan() {
    if (!scan || !videoRef.current || scanning.current) {
      return;
    }

    scanning.current = true;
    const result = await xQrScanner.scanVideo(videoRef.current);
    onScan(result);
    scanning.current = false;
  }

  useInterval(attemptScan, scan ? 1000 / attemptsPerSecond : null);

  return (
    <MediaStreamPlayer
      messages={messages}
      active={showVideo}
      ref={videoRef}
      mediaStream={media}
    />
  );
}
