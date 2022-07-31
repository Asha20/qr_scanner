import { useRef } from "react";
import { Camera, Torch } from "~/components/Camera";
import { useInterval } from "~/hooks/useInterval";
import * as xQrScanner from "~/logic/qr_scanner";

const SCAN_ATTEMPTS_PER_SECOND = 10;

export interface QrScannerProps {
  media: MediaStream | undefined;
  torch: Torch | undefined;
  onScan(result: xQrScanner.ScanResult): void;
}

export function QrScanner({ media, torch, onScan }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanning = useRef(false);

  async function attemptScan() {
    if (!videoRef.current || scanning.current) {
      return;
    }

    scanning.current = true;
    const result = await xQrScanner.scanVideo(videoRef.current);
    onScan(result);
    scanning.current = false;
  }

  useInterval(attemptScan, 1000 / SCAN_ATTEMPTS_PER_SECOND);

  return <Camera ref={videoRef} mediaStream={media} torch={torch} />;
}
