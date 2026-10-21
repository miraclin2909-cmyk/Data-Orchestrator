
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
        width: 310,
        padding: 18,
        borderRadius: 16,
        background: "linear-gradient(155deg, #111C26 0%, #080D13 100%)",
        color: "#E8F7FF",
        border: "1px solid #275565",
        boxShadow: "0 0 25px rgba(30,190,220,0.13), 0 16px 40px rgba(0,0,0,0.45)",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 13,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            display: "grid",
            placeItems: "center",
            borderRadius: 11,
            background: "#102E3A",
            color: "#4CE4FF",
            fontSize: 23,
            boxShadow: "inset 0 0 14px rgba(76,228,255,0.12)",
          }}
        >
          ◈
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, letterSpacing: 1.4 }}>
            ENVIRONMENT
          </div>
          <div style={{ color: "#6F9AAA", fontSize: 10, letterSpacing: 2, marginTop: 3 }}>
            TELEMETRY / LIVE SYSTEM
          </div>
        </div>
        <div
          title={latest ? "Prediction received" : "Waiting for prediction"}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: latest ? "#48E0AD" : "#E9AB48",
            boxShadow: `0 0 12px ${latest ? "#48E0AD" : "#E9AB48"}`,
          }}
        />
      </div>

      <div style={{ height: 1, background: "linear-gradient(90deg, #38DDF5, #243744, transparent)", margin: "17px 0" }} />

      {!latest ? (
        <div style={{ color: "#9CB5C3", padding: "18px 4px", lineHeight: 1.6 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.4, marginBottom: 8 }}>
            INITIALIZING TELEMETRY
          </div>
          {error || "Waiting for sensor data and ML prediction..."}
        </div>
      ) : (
        <>
          <div style={{ color: "#79A0B0", fontSize: 10, letterSpacing: 1.8 }}>
            AMBIENT TEMPERATURE
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 4 }}>
            <span
              style={{
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: -2,
                lineHeight: 1.2,
                color: "#F2B85C",
                textShadow: "0 0 22px rgba(242,184,92,0.15)",
              }}
            >
              {latest.temperature.toFixed(1)}
            </span>
            <span style={{ fontSize: 17, color: "#C7A46B" }}>°C</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 17px" }}>
            <div style={{ height: 4, flex: 1, background: "#26323B", borderRadius: 5, overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, latest.temperature / 80 * 100))}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #3ED9E8, #F2B85C, #FF685F)",
                  borderRadius: 5,
                  boxShadow: "0 0 10px rgba(242,184,92,0.3)",
                }}
              />
            </div>
            <span style={{ color: "#7995A4", fontSize: 10 }}>TEMP</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            <div style={{ background: "#121F29", border: "1px solid #233B49", borderRadius: 10, padding: 12 }}>
              <div style={{ color: "#7EA1B0", fontSize: 10, letterSpacing: 1 }}>HUMIDITY</div>
              <div style={{ color: "#4CE4FF", fontSize: 23, fontWeight: 750, marginTop: 7 }}>
                {latest.humidity.toFixed(1)}<span style={{ fontSize: 12, marginLeft: 3 }}>%</span>
              </div>
            </div>

            <div style={{ background: "#121F29", border: "1px solid #233B49", borderRadius: 10, padding: 12 }}>
              <div style={{ color: "#7EA1B0", fontSize: 10, letterSpacing: 1 }}>ML RISK</div>
              <div
                style={{
                  color: latest.prediction.risk.toUpperCase() === "CRITICAL" ? "#FF7474" : latest.prediction.risk.toUpperCase() === "WARNING" ? "#F2B85C" : "#48E0AD",
                  fontSize: 18,
                  fontWeight: 800,
                  marginTop: 9,
                  textShadow: "0 0 12px currentColor",
                }}
              >
                {latest.prediction.risk.toUpperCase()}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, marginBottom: 9, fontSize: 10, letterSpacing: 1.7, color: "#7999A8" }}>
            OUTPUT PREDICTIONS
          </div>

          {[
            { label: "COOLING FAN", value: latest.prediction.fan, icon: "◉" },
            { label: "ALERT INDICATOR", value: latest.prediction.led, icon: "◈" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 12px",
                marginBottom: 7,
                borderRadius: 9,
                background: item.value ? "rgba(58,215,174,0.07)" : "#121B23",
                border: `1px solid ${item.value ? "rgba(58,215,174,0.3)" : "#253540"}`,
              }}
            >
              <span style={{ color: item.value ? "#48E0AD" : "#647D8B", fontSize: 18 }}>
                {item.icon}
              </span>
              <span style={{ flex: 1, fontSize: 11, letterSpacing: 0.8, fontWeight: 650 }}>
                {item.label}
              </span>
              <span style={{ color: item.value ? "#48E0AD" : "#80919D", fontWeight: 800, fontSize: 11 }}>
                {item.value ? "● ON" : "○ OFF"}
              </span>
            </div>
          ))}

          <div style={{ borderTop: "1px solid #243541", marginTop: 14, paddingTop: 10, display: "flex", justifyContent: "space-between", color: "#648391", fontSize: 10 }}>
            <span>BOARD LINK</span>
            <span>{latest.boardId}</span>
          </div>
        </>
      )}
    </div>
  );
}
