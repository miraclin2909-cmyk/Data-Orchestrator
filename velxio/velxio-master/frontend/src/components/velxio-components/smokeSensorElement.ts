
class VelxioSmokeSensorElement extends HTMLElement {
  private root: ShadowRoot;
  private smokeLevel = 0;
  private alarm = false;

  static get observedAttributes() {
    return ["smoke-level", "alarm"];
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;

    const level = Number(this.getAttribute("smoke-level"));
    this.smokeLevel = Number.isFinite(level)
      ? Math.max(0, Math.min(100, level))
      : 0;

    this.alarm = this.getAttribute("alarm") === "true";
    this.render();
  }

  get pinInfo() {
    return [
      { name: "VCC", x: 0, y: 30 },
      { name: "GND", x: 0, y: 58 },
      { name: "AO", x: 112, y: 30 },
      { name: "DO", x: 112, y: 58 },
    ];
  }

  get smoke() {
    return this.smokeLevel;
  }

  set smoke(value: number) {
    this.smokeLevel = Math.max(0, Math.min(100, Number(value) || 0));
    this.render();
  }

  get alarmState() {
    return this.alarm;
  }

  set alarmState(value: boolean) {
    this.alarm = Boolean(value);
    this.render();
  }

  private render() {
    const level = this.smokeLevel;
    const alarm = this.alarm;

    this.root.innerHTML = `
      <style>
        :host {
          display: block;
          width: 112px;
          height: 112px;
          font-family: monospace;
        }

        .board {
          box-sizing: border-box;
          width: 112px;
          height: 112px;
          position: relative;
          border: 2px solid #15803d;
          border-radius: 9px;
          background: linear-gradient(145deg, #166534, #052e16);
          box-shadow: 0 4px 12px #0005;
        }

        .sensor {
          position: absolute;
          width: 43px;
          height: 43px;
          top: 8px;
          left: 32px;
          border: 3px solid #94a3b8;
          border-radius: 45%;
          background: repeating-linear-gradient(
            0deg, #64748b 0 3px, #cbd5e1 3px 5px
          );
          box-shadow: inset 0 0 0 4px #475569, 0 2px 4px #0008;
        }

        .sensor::after {
          content: "";
          position: absolute;
          inset: 7px;
          border: 2px dotted #334155;
          border-radius: 50%;
          background: #94a3b8;
        }

        .chip {
          position: absolute;
          bottom: 8px;
          left: 12px;
          width: 40px;
          height: 19px;
          background: #111827;
          border: 1px solid #64748b;
          border-radius: 3px;
        }

        .led {
          position: absolute;
          right: 14px;
          bottom: 17px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${alarm ? "#ef4444" : "#22c55e"};
          box-shadow: 0 0 ${alarm ? "12px #ef4444" : "8px #22c55e"};
          animation: ${alarm ? "pulse .7s infinite alternate" : "none"};
        }

        .label {
          position: absolute;
          top: 59px;
          width: 100%;
          text-align: center;
          color: #dcfce7;
          font-size: 9px;
          font-weight: bold;
        }

        .level {
          position: absolute;
          top: 72px;
          width: 100%;
          text-align: center;
          color: ${alarm ? "#fca5a5" : "#86efac"};
          font-size: 9px;
        }

        .pin {
          position: absolute;
          width: 7px;
          height: 12px;
          background: #fbbf24;
          border: 1px solid #92400e;
        }

        .l1 { left: -5px; top: 24px; }
        .l2 { left: -5px; top: 52px; }
        .r1 { right: -5px; top: 24px; }
        .r2 { right: -5px; top: 52px; }

        @keyframes pulse {
          from { opacity: .45; }
          to { opacity: 1; }
        }
      </style>

      <div class="board">
        <div class="sensor"></div>
        <div class="label">SMOKE / GAS</div>
        <div class="level">${level}% · ${alarm ? "ALARM" : "NORMAL"}</div>
        <div class="chip"></div>
        <div class="led"></div>
        <div class="pin l1"></div>
        <div class="pin l2"></div>
        <div class="pin r1"></div>
        <div class="pin r2"></div>
      </div>
    `;
  }
}

if (!customElements.get("velxio-smoke-sensor")) {
  customElements.define("velxio-smoke-sensor", VelxioSmokeSensorElement);
}
