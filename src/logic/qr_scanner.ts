import { assert } from "~/util/assert";

declare function ZXing(): Promise<ZXing.Instance>;

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace ZXing {
  type BufferId = number;
  type Buffer = Uint8ClampedArray;
  type Format = "QR_CODE";

  export interface Point {
    x: number;
    y: number;
  }

  export interface ScanResult {
    format: "" | "QRCode";
    text: string;
    error: string;
    position: {
      topLeft: Point;
      topRight: Point;
      bottomLeft: Point;
      bottomRight: Point;
    };
  }

  export interface Instance {
    _malloc(byteLength: number): BufferId;
    _free(buffer: BufferId): void;

    readBarcodeFromPixmap(
      buffer: BufferId,
      width: number,
      height: number,
      something: boolean,
      format: Format,
    ): ScanResult;

    HEAPU8: {
      set(source: Buffer, dest: BufferId): void;
    };
  }
}

type ScanResult = { success: true; value: string } | { success: false };

export interface QrScanner {
  scan(imageData: ImageData): ScanResult;
  scanVideo(video: HTMLVideoElement): ScanResult;
}

let pending: Promise<ZXing.Instance>;
let zxing: ZXing.Instance;

export async function init(): Promise<QrScanner> {
  if (!pending) {
    pending = ZXing();
  }

  if (!zxing) {
    zxing = await pending;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  function scan(imageData: ImageData): ScanResult {
    const sourceBuffer = imageData.data;

    const buffer = zxing._malloc(sourceBuffer.byteLength);
    zxing.HEAPU8.set(sourceBuffer, buffer);

    const result = zxing.readBarcodeFromPixmap(
      buffer,
      imageData.width,
      imageData.height,
      true,
      "QR_CODE",
    );
    zxing._free(buffer);

    if (result.format === "QRCode") {
      return { success: true, value: result.text };
    }

    return { success: false };
  }

  function scanVideo(video: HTMLVideoElement): ScanResult {
    if (video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
      return { success: false };
    }

    assert(ctx);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return scan(imageData);
  }

  return { scan, scanVideo };
}
