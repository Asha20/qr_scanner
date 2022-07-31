declare module "~/vendor/zxing/zxing_reader" {
  export default function init(): Promise<ZXing.Instance>;

  export namespace ZXing {
    type BufferId = number;
    type Buffer = Uint8ClampedArray;

    interface FormatMap {
      AZTEC: "Aztec";
      CODABAR: "Codabar";
      CODE_39: "Code39";
      CODE_93: "Code93";
      CODE_128: "Code128";
      DATA_MATRIX: "DataMatrix";
      EAN_8: "EAN-8";
      EAN_13: "EAN-13";
      ITF: "ITF";
      MAXICODE: "MaxiCode";
      PDF_417: "PDF417";
      QR_CODE: "QRCode";
      MICRO_QR_CODE: "MicroQRCode";
      DATA_BAR: "DataBar";
      DATA_BAR_EXPANDED: "DataBarExpanded";
      UPC_A: "UPC-A";
      UPC_E: "UPC-E";
    }

    type Format = keyof FormatMap & string;
    type FormatName = FormatMap[Format];

    export interface Point {
      x: number;
      y: number;
    }

    export interface ScanResult {
      format: "" | FormatName;
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
      _free(bufferId: BufferId): void;

      readBarcodeFromPixmap(
        bufferId: BufferId,
        width: number,
        height: number,
        tryHarder: boolean,
        format: Format,
      ): ScanResult;

      HEAPU8: {
        set(source: Buffer, dest: BufferId): void;
      };
    }
  }
}
