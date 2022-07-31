import { useRef } from "react";
import { MediaStreamPlayer, Torch } from "~/components/MediaStreamPlayer";
import { useInterval } from "~/hooks/useInterval";
import * as xQrScanner from "./qr_scanner";

export interface QrScannerProps {
  media: MediaStream | undefined;
  torch: Torch | undefined;
  scan: boolean;
  attemptsPerSecond: number;
  onScan(result: xQrScanner.ScanResult): void;
}

export function QrScanner({
  media,
  torch,
  scan,
  attemptsPerSecond,
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

  return <MediaStreamPlayer ref={videoRef} mediaStream={media} torch={torch} />;
}
