export interface Camera {
  start(): Promise<{ media: MediaStream; supportsTorch: boolean }>;
  stop(): void;
  setTorch(value: ConstrainBoolean): boolean;

  readonly active: boolean;
  readonly stream: MediaStream | null;
}

interface State {
  stream: MediaStream | null;
  torch: ConstrainBoolean;
}

// The torch property seems to be missing, so add it manually.
declare global {
  interface MediaTrackCapabilities {
    torch?: boolean;
  }

  interface MediaTrackConstraintSet {
    torch?: ConstrainBoolean;
  }
}

export function Camera(constraints: MediaTrackConstraints): Camera {
  const state: State = {
    stream: null,
    torch: constraints.torch ?? false,
  };

  let supportsTorch: boolean;

  function setTorchConstraint(value: ConstrainBoolean): boolean {
    if (!state.stream) {
      return false;
    }

    const track = state.stream.getVideoTracks()[0];

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

  return {
    async start() {
      if (state.stream) {
        return { media: state.stream, supportsTorch };
      }

      state.stream = await navigator.mediaDevices.getUserMedia({
        video: constraints,
      });

      supportsTorch = setTorchConstraint(false);

      return { media: state.stream, supportsTorch };
    },

    stop() {
      if (!state.stream) {
        return;
      }

      state.stream.getTracks().forEach(track => {
        track.stop();
      });

      state.stream = null;
    },

    setTorch(value) {
      state.torch = value;
      return setTorchConstraint(state.torch);
    },

    get active() {
      return Boolean(state.stream);
    },

    get stream() {
      return state.stream;
    },
  };
}
