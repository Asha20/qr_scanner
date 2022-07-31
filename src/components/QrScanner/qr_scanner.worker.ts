/* eslint-env worker */

import type { ProcessRequest, ScanResult } from "./qr_scanner";
import initZXing, { type ZXing } from "~/vendor/zxing/zxing_reader";

type RequestMessage = ProcessRequest;
type ResponseMessage = ScanResult;

function reply(msg: ResponseMessage) {
  postMessage(msg);
}

let zxingPromise: Promise<ZXing.Instance>;
let zxing: ZXing.Instance;

async function init(): Promise<ZXing.Instance> {
  if (!zxingPromise) {
    zxingPromise = initZXing();
  }

  if (!zxing) {
    zxing = await zxingPromise;
  }

  return zxing;
}

const bufferCache: { size: number; buffer: number | null } = {
  size: 0,
  buffer: null,
};

function scan(zxing: ZXing.Instance, imageData: ImageData): ScanResult {
  const sourceBuffer = imageData.data;

  if (bufferCache.buffer === null) {
    bufferCache.size = sourceBuffer.byteLength;
    bufferCache.buffer = zxing._malloc(sourceBuffer.byteLength);
  } else if (sourceBuffer.byteLength !== bufferCache.size) {
    zxing._free(bufferCache.buffer);
    bufferCache.size = sourceBuffer.byteLength;
    bufferCache.buffer = zxing._malloc(sourceBuffer.byteLength);
  }

  const buffer = bufferCache.buffer;
  zxing.HEAPU8.set(sourceBuffer, buffer);

  const result = zxing.readBarcodeFromPixmap(
    buffer,
    imageData.width,
    imageData.height,
    true,
    "QR_CODE",
  );

  if (result.format === "QRCode") {
    return { success: true, value: result.text };
  }

  return { success: false };
}

async function handleRequest(zxing: ZXing.Instance, msg: RequestMessage) {
  const imageData = new ImageData(
    new Uint8ClampedArray(msg.buffer),
    msg.width,
    msg.height,
  );

  const result = scan(zxing, imageData);
  reply(result);
}

globalThis.addEventListener("message", async e => {
  const zxing = await init();
  handleRequest(zxing, e.data);
});
