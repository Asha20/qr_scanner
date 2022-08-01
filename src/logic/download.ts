const element = document.createElement("a");

export function downloadString(filename: string, text: string) {
  element.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
  element.download = filename;
  element.click();
}
