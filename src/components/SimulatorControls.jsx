import React from "react";

export default function SimulatorControls({ onTabSwitch, openTabs, setOpenTabs, onReset }) {
  return (
    <div className="controls">
      <h3>Simulator Controls</h3>
      <div>
        <button onClick={onTabSwitch}>Simulate Tab Switch</button>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Open Tabs:</label>
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          {openTabs.map((t, i) => (
            <div key={i} className="tab-pill">{t}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={onReset}>Reset Demo</button>
      </div>
    </div>
  );
}
