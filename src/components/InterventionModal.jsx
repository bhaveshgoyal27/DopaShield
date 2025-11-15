import React, { useEffect, useState } from "react";

export default function InterventionModal({ open, intervention, detected, onClose }) {
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [breaths, setBreaths] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (timer <= 0) setRunning(false);
  }, [timer]);

  const startFocus = (seconds = 180) => {
    setTimer(seconds);
    setRunning(true);
  };

  const startBreathing = async () => {
    setBreaths(0);
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 2400));
      setBreaths((b) => b + 1);
    }
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{detected?.name ?? "Cheap dopamine loop detected"}</h3>
        <p>{detected?.explanation ?? "We detected attention fragmentation."}</p>
        <div className="suggestions">
          <h4>Suggested action</h4>
          <div><strong>{intervention?.title ?? "Reset focus"}</strong></div>
          <div>{intervention?.desc ?? "Try a quick grounding exercise."}</div>
        </div>

        <div className="modal-actions">
          <button onClick={() => startBreathing()}>Do 10 Deep Breaths</button>
          <button onClick={() => startFocus(180)}>Lock-in for 3 minutes</button>
          <button onClick={onClose}>Dismiss</button>
        </div>

        <div style={{ marginTop: 12 }}>
          {running && <div>Timer: {timer}s</div>}
          {breaths > 0 && <div>Breaths done: {breaths}/10</div>}
        </div>
      </div>
    </div>
  );
}
