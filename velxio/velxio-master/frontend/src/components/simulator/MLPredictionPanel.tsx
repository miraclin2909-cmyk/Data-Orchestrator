
import { useEffect, useState } from "react";

interface MLPrediction {
  risk: string;
  fan: boolean;
  led: boolean;
}

interface PredictionEvent {
  boardId: string;
  temperature: number;
  humidity: number;
  prediction: MLPrediction;
}

export function MLPredictionPanel() {
  const [latest, setLatest] = useState<PredictionEvent | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const handlePrediction = (event: Event) => {
      const customEvent = event as CustomEvent<PredictionEvent>;
      setLatest(customEvent.detail);
      setError("");
    };

    const handleError = () => {
      setError("Waiting for a successful ML prediction...");
    };

    window.addEventListener(
      "velxio-ml-prediction",
      handlePrediction
    );
    window.addEventListener("velxio-ml-error", handleError);

    return () => {
      window.removeEventListener(
        "velxio-ml-prediction",
        handlePrediction
      );
      window.removeEventListener("velxio-ml-error", handleError);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        right: 16,
        zIndex: 1000,
        width: 240,
        padding: 16,
        borderRadius: 10,
        background: "var(--wb-2)",
        color: "var(--wb-13)",
        border: "1px solid var(--wb-7)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        fontSize: 13,
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 15 }}>
        Python ML Prediction
      </h3>

      {!latest ? (
        <p style={{ margin: 0 }}>
          {error || "Waiting for sensor data and ML prediction..."}
        </p>
      ) : (
        <>
          <p>Temperature: {latest.temperature.toFixed(1)} °C</p>
          <p>Humidity: {latest.humidity.toFixed(1)} %</p>
          <p>
            Risk: <strong>{latest.prediction.risk}</strong>
          </p>
          <p>Fan: <strong>{latest.prediction.fan ? "ON" : "OFF"}</strong></p>
          <p>LED: <strong>{latest.prediction.led ? "ON" : "OFF"}</strong></p>
          <p style={{ marginBottom: 0, opacity: 0.7, fontSize: 11 }}>
            Board: {latest.boardId}
          </p>
        </>
      )}
    </div>
  );
}
