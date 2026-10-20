
import { installSerialTap } from "../store/serialTap";

export interface SensorReading {
  temperature: number;
  humidity: number;
}

export interface MLPrediction {
  risk: string;
  fan: boolean;
  led: boolean;
}

export async function getMLPrediction(
  reading: SensorReading,
): Promise<MLPrediction> {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reading),
  });

  if (!response.ok) {
    throw new Error(`Python ML bridge returned HTTP ${response.status}`);
  }

  return (await response.json()) as MLPrediction;
}

const serialBuffers = new Map<string, string>();

export function startMLSerialListener(): void {
  installSerialTap((boardId, chunk) => {
    const text = (serialBuffers.get(boardId) ?? "") + chunk;
    const lines = text.split(/\r?\n/);
    serialBuffers.set(boardId, lines.pop() ?? "");

    for (const line of lines) {
      const match = line.match(
        /Temperature:\s*(-?\d+(?:\.\d+)?)\s*C.*Humidity:\s*(-?\d+(?:\.\d+)?)/
      );

      if (!match) continue;

      const temperature = Number(match[1]);
      const humidity = Number(match[2]);

      void getMLPrediction({ temperature, humidity })
        .then(async (prediction) => {
          const { getBoardPinManager } = await import(
            "../store/useSimulatorStore"
          );
          const pm = getBoardPinManager(boardId);

          pm?.triggerPinChange(17, prediction.fan, "mcu");
          pm?.triggerPinChange(16, prediction.led, "mcu");

          window.dispatchEvent(
            new CustomEvent("velxio-ml-prediction", {
              detail: { boardId, temperature, humidity, prediction },
            })
          );
        })
        .catch((error: unknown) => {
          console.error("[Velxio ML] Bridge request failed:", error);
        });
    }
  });
}
