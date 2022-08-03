import { assert } from "~/util/assert";
import QrScannerWorker from "./qr_scanner.worker?worker";

export interface ProcessRequest {
  buffer: ArrayBuffer;
  width: number;
  height: number;
}

export type ScanResult =
  | { success: true; format: string; value: string }
  | { success: false };

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const qrWorker = new QrScannerWorker();

function waitMessage(worker: Worker) {
  return new Promise(resolve => {
    worker.addEventListener(
      "message",
      e => {
        resolve(e.data);
      },
      { once: true },
    );
  });
}

let prevVideo: HTMLVideoElement;

export async function scanVideo(video: HTMLVideoElement): Promise<ScanResult> {
  if (video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
    return { success: false };
  }

  assert(ctx);
  if (video !== prevVideo) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const request: ProcessRequest = {
    buffer: imageData.data.buffer,
    width: imageData.width,
    height: imageData.height,
  };

  qrWorker.postMessage(request, [imageData.data.buffer]);
  const reply = (await waitMessage(qrWorker)) as ScanResult;

  prevVideo = video;
  return reply;
}
