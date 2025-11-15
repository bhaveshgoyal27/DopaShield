import React from 'react';

export default function Dashboard({ points, onSimulatePoints }) {
  return (
    <div className="dashboard">
      <h2>Your Focus Points</h2>
      <p style={{ fontSize: '1.5rem', margin: 0 }}>{points}</p>
      <button onClick={onSimulatePoints}>
        +5 Focus Points (simulate)
      </button>
    </div>
  );
}
