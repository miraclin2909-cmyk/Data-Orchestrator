
const FAN_STYLE_ID = 'velxio-dc-fan-style';

if (!document.getElementById(FAN_STYLE_ID)) {
  const style = document.createElement('style');
  style.id = FAN_STYLE_ID;
  style.textContent = `
    .velxio-dc-fan {
      width: 112px;
      height: 112px;
      position: relative;
      display: grid;
      place-items: center;
      user-select: none;
    }

    .velxio-dc-fan .fan-housing {
      width: 96px;
      height: 96px;
      border: 5px solid #475569;
      border-radius: 50%;
      background: radial-gradient(circle, #e2e8f0 0 54%, #94a3b8 56% 63%, #334155 65%);
      display: grid;
      place-items: center;
      box-shadow: 0 3px 7px #0005;
    }

    .velxio-dc-fan .fan-rotor {
      width: 68px;
      height: 68px;
      position: relative;
      border-radius: 50%;
    }

    .velxio-dc-fan .fan-blade {
      position: absolute;
      left: 25px;
      top: 2px;
      width: 18px;
      height: 34px;
      background: linear-gradient(90deg, #0284c7, #38bdf8);
      border: 1px solid #0369a1;
      border-radius: 85% 15% 70% 25%;
      transform-origin: 9px 32px;
    }

    .velxio-dc-fan .fan-blade:nth-child(2) {
      transform: rotate(90deg);
    }

    .velxio-dc-fan .fan-blade:nth-child(3) {
      transform: rotate(180deg);
    }

    .velxio-dc-fan .fan-blade:nth-child(4) {
      transform: rotate(270deg);
    }

    .velxio-dc-fan .fan-hub {
      position: absolute;
      width: 17px;
      height: 17px;
      left: 25px;
      top: 25px;
      border-radius: 50%;
      background: #e2e8f0;
      border: 3px solid #334155;
      z-index: 2;
    }

    .velxio-dc-fan .fan-status {
      position: absolute;
      bottom: -12px;
      left: 0;
      width: 100%;
      text-align: center;
      font: bold 10px monospace;
      color: #dc2626;
    }

    .velxio-dc-fan[data-running="true"] .fan-rotor {
      animation: velxio-fan-spin var(--fan-speed, 0.25s) linear infinite;
    }

    .velxio-dc-fan[data-running="true"] .fan-status {
      color: #16a34a;
    }

    @keyframes velxio-fan-spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

class VelxioDcFanElement extends HTMLElement {
  private running = true;
  private speed = 0.25;
  private root: ShadowRoot;

  static get observedAttributes() {
    return ['running', 'speed'];
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.syncAttributes();
  }

  get pinInfo() {
    return [
      { name: '+', x: 0, y: 56 },
      { name: '-', x: 112, y: 56 },
    ];
  }

  get isRunning() {
    return this.running;
  }

  set isRunning(value: boolean) {
    this.running = Boolean(value);
    this.render();
  }

  get fanSpeed() {
    return this.speed;
  }

  set fanSpeed(value: number) {
    this.speed = Math.max(0.05, Math.min(2, Number(value) || 0.25));
    this.render();
  }

  private syncAttributes() {
    if (this.hasAttribute('running')) {
      this.running = this.getAttribute('running') !== 'false';
    }
    if (this.hasAttribute('speed')) {
      this.speed = Math.max(
        0.05,
        Math.min(2, Number(this.getAttribute('speed')) || 0.25),
      );
    }
    if (this.isConnected) this.render();
  }

  private render() {
    this.root.innerHTML = `
      <style>
        :host { display:block; width:112px; height:112px; }
        .fan { width:112px; height:112px; position:relative; display:grid; place-items:center; }
        .housing { width:96px; height:96px; border:5px solid #475569; border-radius:50%; background:radial-gradient(circle,#e2e8f0 0 54%,#94a3b8 56% 63%,#334155 65%); display:grid; place-items:center; box-shadow:0 3px 7px #0005; }
        .rotor { width:68px; height:68px; position:relative; border-radius:50%; }
        .blade { position:absolute; left:25px; top:2px; width:18px; height:34px; background:linear-gradient(90deg,#0284c7,#38bdf8); border:1px solid #0369a1; border-radius:85% 15% 70% 25%; transform-origin:9px 32px; }
        .blade:nth-child(2) { transform:rotate(90deg); }
        .blade:nth-child(3) { transform:rotate(180deg); }
        .blade:nth-child(4) { transform:rotate(270deg); }
        .hub { position:absolute; width:17px; height:17px; left:25px; top:25px; border-radius:50%; background:#e2e8f0; border:3px solid #334155; z-index:2; }
        .status { position:absolute; bottom:-12px; width:100%; text-align:center; font:bold 10px monospace; color:#dc2626; }
        .rotor.running { animation:spin ${this.speed}s linear infinite; }
        .running + .hub { color:green; }
        @keyframes spin { to { transform:rotate(360deg); } }
      </style>
      <div class="fan">
        <div class="housing">
          <div class="rotor ${this.running ? 'running' : ''}">
            <div class="blade"></div><div class="blade"></div>
            <div class="blade"></div><div class="blade"></div>
          </div>
          <div class="hub"></div>
        </div>
        <div class="status">${this.running ? 'FAN ON' : 'FAN OFF'}</div>
      </div>
    `;
  }
}

if (!customElements.get('velxio-dc-fan')) {
  customElements.define('velxio-dc-fan', VelxioDcFanElement);
}
