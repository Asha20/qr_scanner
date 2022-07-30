declare module "~/vendor/zxing/zxing_reader" {
  export default function init(): Promise<ZXing.Instance>;

  export namespace ZXing {
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
}
