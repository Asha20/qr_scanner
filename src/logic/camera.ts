// The torch property seems to be missing, so add it manually.
declare global {
  interface MediaTrackCapabilities {
    torch?: boolean;
  }

  interface MediaTrackConstraintSet {
    torch?: ConstrainBoolean;
  }
}

interface CameraStream {
  setTorch(value: ConstrainBoolean): boolean;
  stop(): void;
  readonly supportsTorch: boolean;
  readonly mediaStream: MediaStream;
}

export async function Camera(
  constraints: MediaTrackConstraints,
): Promise<CameraStream> {
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: constraints,
  });

  const supportsTorch = setTorch(constraints.torch ?? false);

  function setTorch(value: ConstrainBoolean): boolean {
    const track = mediaStream.getVideoTracks()[0];

    // No support for getCapabilities in Firefox yet:
    // https://caniuse.com/mdn-api_mediastreamtrack_getcapabilities
    if (typeof track.getCapabilities === "function") {
      const capabilities = track.getCapabilities();
      if (!capabilities.torch) {
        return false;
      }
    }

    try {
      track.applyConstraints({ advanced: [{ torch: value }] });
      return true;
    } catch {
      return false;
    }
  }

  function stop() {
    for (const track of mediaStream.getTracks()) {
      track.stop();
    }
  }

  return {
    setTorch,
    stop,
    get supportsTorch() {
      return supportsTorch;
    },
    get mediaStream() {
      return mediaStream;
    },
  };
}
