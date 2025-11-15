import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';

export default function App() {
  const [points, setPoints] = useState(0);

  const simulateFocus = () => {
    setPoints(prev => prev + 5);
  };

  return (
    <div className="app">
      <header>
        <h1>DopaShield Marketplace</h1>
        <p>Focus more. Scroll less. Earn rewards from Ithaca‑area sustainable businesses.</p>
      </header>
      <Dashboard points={points} onSimulatePoints={simulateFocus} />
      <Marketplace points={points} setPoints={setPoints} />
    </div>
  );
}
