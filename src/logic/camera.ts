interface Camera {
  start(): Promise<MediaStream>;
  stop(): void;
  setTorch(value: boolean): void;

  readonly active: boolean;
  readonly stream: MediaStream | null;
}

interface State {
  stream: MediaStream | null;
  torch: boolean;
}

interface CameraConfig {
  torch: boolean;
  constraints: MediaStreamConstraints;
}

export function Camera(config: CameraConfig): Camera {
  const state: State = {
    stream: null,
    torch: config.torch,
  };

  function setTorchConstraint(value: boolean) {
    if (!state.stream) {
      return;
    }

    const track = state.stream.getVideoTracks()[0];
    // WHY: MediaTrackConstraintSet doesn't include the `torch` property.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    track.applyConstraints({ advanced: [{ torch: value } as any] });
  }

  return {
    async start() {
      if (state.stream) {
        return state.stream;
      }

      state.stream = await navigator.mediaDevices.getUserMedia(
        config.constraints,
      );

      if (state.torch) {
        setTorchConstraint(state.torch);
      }

      return state.stream;
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
      setTorchConstraint(state.torch);
    },

    get active() {
      return Boolean(state.stream);
    },

    get stream() {
      return state.stream;
    },
  };
}
