const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY || "";

export async function analyzeWithLLM(log, ruleResult) {
  if (!OPENAI_KEY) {
    return null;
  }

  const system = `You are a friendly assistant that, given a short behavioral log from a student studying,
detects cheap dopamine loops and returns a JSON with fields: name, severity (1-5), explanation, suggestions (array of {title,desc}). Keep JSON parseable.`;

  const user = `Behavior log: ${JSON.stringify(log)}
Detected patterns (rule-based): ${JSON.stringify(ruleResult)}
Return JSON only.`;

  const body = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    max_tokens: 250,
    temperature: 0.6
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error("LLM request failed: " + txt);
  }

  const data = await resp.json();
  const txt = data.choices?.[0]?.message?.content ?? "";
  try {
    const parsed = JSON.parse(txt);
    return parsed;
  } catch (e) {
    return {
      name: ruleResult.name,
      severity: ruleResult.severity,
      explanation: ruleResult.reason,
      suggestions: ruleResult.suggestions
    };
  }
}
