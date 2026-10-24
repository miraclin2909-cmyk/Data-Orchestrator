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

interface SensorReading {
  componentId: string;
  sensorType: "smoke" | "gas";
  value: number;
}

const COLORS = {
  bg: "#090E14",
  panel: "#101923",
  border: "#243442",
  text: "#E8F3FA",
  muted: "#7891A2",
  cyan: "#45DDF5",
  green: "#49E0AD",
  amber: "#F2B85C",
  red: "#FF7078",
};

function riskColor(risk: string) {
  const value = risk.toUpperCase();
  if (value === "CRITICAL") return COLORS.red;
  if (value === "WARNING") return COLORS.amber;
  return COLORS.green;
}

function MetricCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color: string;
}) {
  return (
    <div
      style={{
        minWidth: 0,
        padding: 13,
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          color: COLORS.muted,
          fontSize: 10,
          letterSpacing: 1.3,
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color,
          fontSize: 25,
          fontWeight: 800,
          marginTop: 8,
          overflowWrap: "anywhere",
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: 12, marginLeft: 4, fontWeight: 600 }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function LevelBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div
      style={{
        height: 5,
        background: "#263440",
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 9,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${percentage}%`,
          background: color,
          borderRadius: 10,
          transition: "width 180ms ease",
        }}
      />
    </div>
  );
}

export function MLPredictionPanel() {
  const [latest, setLatest] = useState<PredictionEvent | null>(null);
  const [error, setError] = useState("");

  const [sensorReadings, setSensorReadings] = useState<
    Record<string, SensorReading>
  >({});

  useEffect(() => {
    const handlePrediction = (event: Event) => {
      const detail = (event as CustomEvent<PredictionEvent>).detail;

      if (!detail?.prediction) return;

      setLatest(detail);
      setError("");
    };

    const handleError = () => {
      setError("Unable to receive an ML prediction.");
    };

    window.addEventListener("velxio-ml-prediction", handlePrediction);
    window.addEventListener("velxio-ml-error", handleError);

    return () => {
      window.removeEventListener("velxio-ml-prediction", handlePrediction);
      window.removeEventListener("velxio-ml-error", handleError);
    };
  }, []);

  useEffect(() => {
    const handleSensorReading = (event: Event) => {
      const reading = (event as CustomEvent<SensorReading>).detail;

      if (
        !reading ||
        (reading.sensorType !== "smoke" &&
          reading.sensorType !== "gas") ||
        typeof reading.value !== "number" ||
        !Number.isFinite(reading.value)
      ) {
        return;
      }

      setSensorReadings((previous) => ({
        ...previous,
        [`${reading.sensorType}:${reading.componentId}`]: reading,
      }));
    };

    window.addEventListener("velxio-sensor-reading", handleSensorReading);

    return () => {
      window.removeEventListener(
        "velxio-sensor-reading",
        handleSensorReading
      );
    };
  }, []);

  const allSensors = Object.values(sensorReadings);

  const smokeSensors = allSensors.filter(
    (sensor) => sensor.sensorType === "smoke"
  );

  const gasSensors = allSensors.filter(
    (sensor) => sensor.sensorType === "gas"
  );

  const sectionStyle = {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.7,
    marginBottom: 10,
  } as const;

  const outputRow = (
    label: string,
    active: boolean,
    symbol: string
  ) => (
    <div
      key={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 12px",
        marginTop: 7,
        borderRadius: 9,
        background: active ? "rgba(73,224,173,0.07)" : "#0C131B",
        border: `1px solid ${
          active ? "rgba(73,224,173,0.28)" : COLORS.border
        }`,
      }}
    >
      <span
        style={{
          color: active ? COLORS.green : COLORS.muted,
          fontSize: 17,
        }}
      >
        {symbol}
      </span>

      <span
        style={{
          flex: 1,
          color: COLORS.text,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: active ? COLORS.green : COLORS.muted,
          fontSize: 10,
          fontWeight: 800,
        }}
      >
        {active ? "ON" : "OFF"}
      </span>
    </div>
  );

  const sensorCard = (
    title: string,
    sensors: SensorReading[],
    max: number,
    color: string
  ) => (
    <div
      key={title}
      style={{
        padding: 12,
        minWidth: 0,
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 11,
      }}
    >
      <div
        style={{
          color: COLORS.muted,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      {sensors.length === 0 ? (
        <div
          style={{
            color: "#647A89",
            fontSize: 11,
            marginTop: 12,
            lineHeight: 1.5,
          }}
        >
          Waiting for sensor input
        </div>
      ) : (
        sensors.map((sensor) => (
          <div key={sensor.componentId} style={{ marginTop: 12 }}>
            <div
              style={{
                color,
                fontSize: 23,
                fontWeight: 800,
                overflowWrap: "anywhere",
              }}
            >
              {sensor.value}
              <span
                style={{
                  color: COLORS.muted,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {" "}
                / {max}
              </span>
            </div>

            <LevelBar
              value={sensor.value}
              max={max}
              color={color}
            />

            <div
              title={sensor.componentId}
              style={{
                color: "#647A89",
                fontSize: 9,
                marginTop: 7,
                overflowWrap: "anywhere",
              }}
            >
              Sensor: {sensor.componentId}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        right: 16,
        zIndex: 1000,
        width: 330,
        maxWidth: "calc(100% - 32px)",
        maxHeight: "calc(100% - 80px)",
        overflowY: "auto",
        boxSizing: "border-box",
        padding: 17,
        borderRadius: 16,
        background: "linear-gradient(155deg, #111C26 0%, #080D13 100%)",
        color: COLORS.text,
        border: "1px solid #294454",
        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 13,
      }}
    >
      {/* Dashboard header */}
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            borderRadius: 11,
            background: "#102E3A",
            color: COLORS.cyan,
            fontSize: 22,
          }}
        >
          ◈
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 850,
              letterSpacing: 1.2,
            }}
          >
            ENVIRONMENT MONITOR
          </div>

          <div
            style={{
              color: COLORS.muted,
              fontSize: 9,
              letterSpacing: 1.4,
              marginTop: 5,
            }}
          >
            SENSOR TELEMETRY & ML
          </div>
        </div>

        <div
          title={
            latest
              ? "ML prediction received"
              : "Waiting for ML prediction"
          }
          style={{
            width: 8,
            height: 8,
            flexShrink: 0,
            borderRadius: "50%",
            background: latest ? COLORS.green : COLORS.amber,
            boxShadow: `0 0 10px ${
              latest ? COLORS.green : COLORS.amber
            }`,
          }}
        />
      </div>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, #38DDF5, #243744, transparent)",
          margin: "16px 0",
        }}
      />

      {/* ML prediction section */}
      <div style={sectionStyle}>MACHINE LEARNING PREDICTION</div>

      {!latest ? (
        <div
          style={{
            padding: 13,
            borderRadius: 10,
            background: "#0C131B",
            border: `1px solid ${COLORS.border}`,
            color: COLORS.muted,
            lineHeight: 1.6,
          }}
        >
          <div
            style={{
              color: COLORS.amber,
              fontWeight: 800,
              fontSize: 11,
              marginBottom: 5,
            }}
          >
            {error ? "PREDICTION ERROR" : "AWAITING PREDICTION"}
          </div>

          {error ||
            "Waiting for temperature and humidity data from the ML bridge."}
        </div>
      ) : (
        <>
          <div
            style={{
              padding: 14,
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              marginBottom: 9,
            }}
          >
            <div
              style={{
                color: COLORS.muted,
                fontSize: 10,
                letterSpacing: 1.2,
                fontWeight: 700,
              }}
            >
              PREDICTED RISK LEVEL
            </div>

            <div
              style={{
                color: riskColor(latest.prediction.risk),
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: 1,
                marginTop: 7,
              }}
            >
              {latest.prediction.risk.toUpperCase()}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
            }}
          >
            <MetricCard
              label="TEMPERATURE"
              value={latest.temperature.toFixed(1)}
              unit="°C"
              color={COLORS.amber}
            />

            <MetricCard
              label="HUMIDITY"
              value={latest.humidity.toFixed(1)}
              unit="%"
              color={COLORS.cyan}
            />
          </div>

          <div
            style={{
              ...sectionStyle,
              marginTop: 18,
              marginBottom: 8,
            }}
          >
            PREDICTED OUTPUTS
          </div>

          {outputRow(
            "COOLING FAN",
            latest.prediction.fan,
            "◉"
          )}

          {outputRow(
            "ALERT INDICATOR",
            latest.prediction.led,
            "◈"
          )}

          <div
            style={{
              color: "#6F9AAA",
              fontSize: 10,
              marginTop: 9,
            }}
          >
            Board: {latest.boardId}
          </div>
        </>
      )}

      <div
        style={{
          height: 1,
          background: COLORS.border,
          margin: "17px 0",
        }}
      />

      {/* Smoke and gas sensor section */}
      <div style={sectionStyle}>AIR QUALITY SENSOR INPUTS</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 9,
        }}
      >
        {sensorCard(
          "SMOKE LEVEL",
          smokeSensors,
          100,
          COLORS.amber
        )}

        {sensorCard(
          "GAS LEVEL",
          gasSensors,
          1023,
          COLORS.cyan
        )}
      </div>

      <div
        style={{
          color: "#617989",
          fontSize: 9,
          lineHeight: 1.6,
          marginTop: 12,
        }}
      >
        Smoke and gas show simulator input levels. They are not
        calibrated real-world concentration measurements.
      </div>
    </div>
  );
}