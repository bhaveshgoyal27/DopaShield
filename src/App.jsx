import React, { useEffect, useState, useRef } from "react";
import Feed from "./components/Feed";
import SimulatorControls from "./components/SimulatorControls";
import InterventionModal from "./components/InterventionModal";
import { analyzeRules, computeAttentionScore } from "./utils/detector";
import { analyzeWithLLM } from "./utils/llm";

export default function App() {
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [tabSwitchRate, setTabSwitchRate] = useState(0);
  const [clickDensity, setClickDensity] = useState(0);
  const [idleBursts, setIdleBursts] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [attentionJitter, setAttentionJitter] = useState(0);

  const [behaviorLog, setBehaviorLog] = useState({});
  const [detected, setDetected] = useState(null);
  const [intervention, setIntervention] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [openTabs, setOpenTabs] = useState(["Task", "Social Feed", "Video"]);

  const tabSwitchesRef = useRef([]);
  const lastInteractionRef = useRef(Date.now());
  const clicksWindowRef = useRef([]);
  const scrollWindowRef = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setSessionTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const check = setInterval(() => {
      const gap = Date.now() - lastInteractionRef.current;
      if (gap > 8000) {
        setIdleBursts((b) => b + 1);
        lastInteractionRef.current = Date.now();
      }
    }, 4000);
    return () => clearInterval(check);
  }, []);

  useEffect(() => {
    const sampler = setInterval(async () => {
      const now = Date.now();
      clicksWindowRef.current = clicksWindowRef.current.filter((t) => now - t <= 10000);
      const clicks = clicksWindowRef.current.length;
      const cd = clicks;
      setClickDensity(cd);

      const recent = scrollWindowRef.current.filter((s) => now - s.t <= 2000);
      let pxSum = 0;
      if (recent.length >= 1) {
        for (const r of recent) pxSum += Math.abs(r.dy);
        const pxPerSec = pxSum / 2;
        setScrollSpeed(Math.round(pxPerSec));
      } else {
        setScrollSpeed(0);
      }

      tabSwitchesRef.current = tabSwitchesRef.current.filter((t) => now - t <= 60000);
      const tsRate = Math.round((tabSwitchesRef.current.length / 60) * 60);
      setTabSwitchRate(tsRate);

      const deltas = recent.map((r) => Math.abs(r.dy));
      const mean = deltas.length ? deltas.reduce((a, b) => a + b, 0) / deltas.length : 0;
      const variance = deltas.length ? deltas.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / deltas.length : 0;
      const jitter = Math.round(Math.sqrt(variance));
      setAttentionJitter(jitter);

      const log = {
        timestamp: new Date().toISOString(),
        scroll_speed: Math.round(pxSum / 2),
        tab_switch_rate: tsRate,
        click_density: cd,
        idle_bursts: idleBursts,
        session_time: sessionTime,
        attention_jitter: jitter
      };
      setBehaviorLog(log);

      const ruleResult = analyzeRules(log);

      if (ruleResult.flagged) {
        let llmResp = null;
        try {
          llmResp = await analyzeWithLLM(log, ruleResult);
        } catch (e) {
          llmResp = null;
          console.warn("LLM call failed or disabled, using rule-based intervention.");
        }

        const final = llmResp ?? {
          name: ruleResult.name,
          severity: ruleResult.severity,
          explanation: ruleResult.reason,
          suggestions: ruleResult.suggestions
        };

        setDetected(final);
        setIntervention(final.suggestions?.[0] ?? { title: "Take a breath", type: "breath" });
        setShowModal(true);
      } else {
        setDetected(null);
      }
    }, 3000);

    return () => clearInterval(sampler);
  }, [idleBursts, sessionTime]);

  const recordInteraction = () => {
    lastInteractionRef.current = Date.now();
  };

  const onFeedClick = () => {
    clicksWindowRef.current.push(Date.now());
    recordInteraction();
  };

  const onFeedScroll = (dy) => {
    scrollWindowRef.current.push({ t: Date.now(), dy });
    if (scrollWindowRef.current.length > 200) scrollWindowRef.current.shift();
    recordInteraction();
  };

  const simulateTabSwitch = () => {
    tabSwitchesRef.current.push(Date.now());
    recordInteraction();
  };

  const dismissModal = () => setShowModal(false);

  const attentionScore = computeAttentionScore({
    scroll_speed: scrollSpeed,
    tab_switch_rate: tabSwitchRate,
    click_density: clickDensity,
    idle_bursts: idleBursts,
    attention_jitter: attentionJitter
  });

  return (
    <div className="app">
      <header className="header">
        <h1>DopaShield — Privacy-First Demo</h1>
        <p className="sub">Local-only simulation of cheap dopamine loop detection & micro-interventions</p>
        <div className="score">Focus Score: <strong>{attentionScore}</strong>/100</div>
      </header>

      <main className="main">
        <aside className="left">
          <SimulatorControls
            onTabSwitch={() => { simulateTabSwitch(); }}
            openTabs={openTabs}
            setOpenTabs={setOpenTabs}
            onReset={() => {
              setIdleBursts(0);
              setClickDensity(0);
              setSessionTime(0);
              scrollWindowRef.current = [];
              clicksWindowRef.current = [];
              tabSwitchesRef.current = [];
              setDetected(null);
              setShowModal(false);
            }}
          />

          <div className="metrics">
            <h3>Live Metrics</h3>
            <div>scroll_speed: {scrollSpeed} px/s</div>
            <div>tab_switch_rate: {tabSwitchRate} /min</div>
            <div>click_density: {clickDensity} /10s</div>
            <div>idle_bursts: {idleBursts}</div>
            <div>attention_jitter: {attentionJitter}</div>
            <div>session_time: {sessionTime}s</div>
          </div>

          <div className="detected">
            <h3>Last Detection</h3>
            {detected ? (
              <>
                <div><strong>{detected.name}</strong> (sev {detected.severity})</div>
                <div>{detected.explanation}</div>
              </>
            ) : <div>No loop detected</div>}
          </div>
        </aside>

        <section className="center">
          <Feed onClick={onFeedClick} onScrollDelta={onFeedScroll} />
        </section>

        <aside className="right">
          <div className="visual">
            <h3>Behavior Log (latest)</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(behaviorLog, null, 2)}</pre>
          </div>

          <div className="intervention-history">
            <h3>Intervention</h3>
            {intervention ? (
              <>
                <div><strong>{intervention.title ?? intervention.action ?? "Intervene"}</strong></div>
                <div>{intervention.desc ?? JSON.stringify(intervention)}</div>
              </>
            ) : <div>—</div>}
          </div>

          <div className="notes">
            <h3>Privacy</h3>
            <p>All signals are generated and processed locally in the browser by default. No browsing history is read or sent anywhere unless you explicitly enable an external LLM key.</p>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <small>Demo built for hackathon pitching — DopaShield (local-only mode)</small>
      </footer>

      <InterventionModal
        open={showModal}
        intervention={intervention}
        detected={detected}
        onClose={dismissModal}
      />
    </div>
  );
}
