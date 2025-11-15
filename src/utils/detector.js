export function analyzeRules(log) {
  const TH = {
    scroll_speed: 450,
    tab_switch_rate: 10,
    click_density: 30,
    idle_bursts: 3,
    attention_jitter: 200
  };

  let flagged = false;
  let reasons = [];
  let severity = 0;
  let suggestions = [];

  if (log.scroll_speed > TH.scroll_speed) {
    flagged = true;
    severity += 2;
    reasons.push("fast_scrolling");
    suggestions.push({ title: "2-min reset", desc: "Slow your scrolling, try a 2-minute grounding." });
  }
  if (log.tab_switch_rate > TH.tab_switch_rate) {
    flagged = true;
    severity += 2;
    reasons.push("tab_hopping");
    suggestions.push({ title: "Focus lock", desc: "You're switching tasks rapidly. Try locking in for 3 minutes." });
  }
  if (log.click_density > TH.click_density) {
    flagged = true;
    severity += 1;
    reasons.push("jittery_clicking");
    suggestions.push({ title: "Micro-break", desc: "Clicking bursts suggest restlessness. Try 30s eyes-closed reset." });
  }
  if (log.idle_bursts >= TH.idle_bursts) {
    flagged = true;
    severity += 1;
    reasons.push("idle_bursting");
    suggestions.push({ title: "Re-engage", desc: "You've been drifting. Recommit to the intended task for 2 minutes." });
  }
  if (log.attention_jitter > TH.attention_jitter) {
    flagged = true;
    severity += 1;
    reasons.push("attention_jitter");
    suggestions.push({ title: "Breathing", desc: "Your attention is jittery — try 6 slow breaths." });
  }

  const name = flagged ? "Cheap Dopamine Loop" : "No loop";
  const reason = flagged ? `Detected patterns: ${reasons.join(", ")}` : "No problematic patterns detected.";

  return {
    flagged,
    name,
    severity,
    reason,
    suggestions
  };
}

export function computeAttentionScore(metrics) {
  let score = 100;

  const penalize = (value, goodMax) => {
    if (value <= goodMax) return 0;
    const pct = Math.min(1, (value - goodMax) / (goodMax || 1));
    return Math.round(pct * 40);
  };

  score -= penalize(metrics.scroll_speed || 0, 200);
  score -= penalize(metrics.tab_switch_rate || 0, 3);
  score -= penalize(metrics.click_density || 0, 8);
  score -= penalize(metrics.idle_bursts || 0, 1);
  score -= penalize(metrics.attention_jitter || 0, 80);

  score = Math.max(0, Math.min(100, score));
  return score;
}
