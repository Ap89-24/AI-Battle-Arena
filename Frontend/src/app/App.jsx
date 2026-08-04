import { useState, useCallback } from "react";
import ParticleBackground from "../components/ParticleBackground";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import LoadingScreen from "../components/LoadingScreen";
import BattleScreen from "../components/BattleScreen";
import Sidebar from "../components/Sidebar";
import { useUser, SignInButton } from "@clerk/clerk-react";

// ====================================================
// DYNAMIC MOCK DATA GENERATOR
// ====================================================
const generateMockTurn = (prompt) => {
  const isCode =
    prompt.toLowerCase().includes("code") ||
    prompt.toLowerCase().includes("write") ||
    prompt.toLowerCase().includes("implement") ||
    prompt.toLowerCase().includes("function") ||
    prompt.toLowerCase().includes("javascript") ||
    prompt.toLowerCase().includes("python");

  const score1 = parseFloat((7.5 + Math.random() * 2.5).toFixed(1));
  const score2 = parseFloat((7.0 + Math.random() * 2.8).toFixed(1));
  const s1Winner = score1 >= score2;

  let solution_1 = "";
  let solution_2 = "";
  let s1Reason = "";
  let s2Reason = "";

  if (isCode) {
    solution_1 = `Here is an optimized solution to: "${prompt}"\n\n### Implementation\n\`\`\`javascript\n// High performance approach\nfunction processRequest(input) {\n  if (!input) return null;\n  // Process using standard map-reduce patterns\n  return Array.isArray(input) \n    ? input.filter(Boolean).map(x => x * 2)\n    : [input * 2];\n}\nconsole.log(processRequest([1, 2, null, 3])); // [2, 4, 6]\n\`\`\`\n\n### Benefits:\n- Handles edge cases like null/undefined.\n- Extremely scalable and utilizes native V8 optimizations.\n- Readable and maintainable.`;

    solution_2 = `Sure! I can help you write code for "${prompt}".\n\n\`\`\`javascript\nconst process = (data) => {\n  let res = [];\n  for(let i=0; i<data.length; i++) {\n    if(data[i] !== null && data[i] !== undefined) {\n      res.push(data[i] * 2);\n    }\n  }\n  return res;\n}\n\`\`\`\n\nThis simple loop iterates over the elements, filters out missing elements, and doubles the valid entries.`;

    s1Reason = s1Winner
      ? "Solution 1 is highly optimized, handles single values or arrays gracefully, and includes comprehensive comments and edge-case testing."
      : "Solution 1 is standard but is slightly over-engineered for a simple filter-map operation.";
    s2Reason = !s1Winner
      ? "Solution 2 is concise, easy to read, uses a simple loop, and gets the job done without extra abstractions."
      : "Solution 2 uses a manual for-loop which is less idiomatic in modern JavaScript and lacks input validation/error checking.";
  } else {
    solution_1 = `### Detailed Analysis on: "${prompt}"\n\nTo answer this question comprehensively, we must look at it from three core dimensions:\n\n1. **Core Definition**: The subject represents a key paradigm shifting concept.\n2. **Theoretical Framework**: Under standard models, this behaves deterministically under specific boundary constraints.\n3. **Practical Application**: In real-world scenarios, it is used to optimize pipelines, reduce overhead, and increase stability.\n\n*Conclusion*: We recommend this approach for long-term scalability.`;

    solution_2 = `Here is the explanation for: "${prompt}".\n\n- **What it is**: A general concept used to describe this specific phenomenon.\n- **Why it matters**: It helps clarify complex dependencies and keeps implementations clean.\n- **Example**: Think of it like a chain of custody where each link verifies the previous one.\n\nHope this helps! Let me know if you need more details.`;

    s1Reason = s1Winner
      ? "Solution 1 structured the analysis professionally into three dimensions and provided a clear conclusion."
      : "Solution 1 is well-written but reads a bit too academic and verbose.";
    s2Reason = !s1Winner
      ? "Solution 2 is highly intuitive, using bullet points and a simple real-world analogy to explain the topic cleanly."
      : "Solution 2 is brief and missing deeper context and technical trade-offs.";
  }

  return {
    problem: prompt,
    solution_1,
    solution_2,
    judge: {
      solution_1_score: score1,
      solution_2_score: score2,
      solution_1_reasoning: s1Reason,
      solution_2_reasoning: s2Reason,
    },
  };
};

export default function App() {
  const [view, setView] = useState("home"); // 'home' | 'loading' | 'battle'
  const [battleData, setBattleData] = useState(null); // { id, turns: [...] }
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isSignedIn } = useUser();

  const handleBattle = useCallback((userPrompt) => {
      if (!isSignedIn) {
        return;
      }
    setPrompt(userPrompt);
    setView("loading");
  }, [isSignedIn]);

  const handleLoadingComplete = useCallback(() => {
    const firstTurn = generateMockTurn(prompt || "Factorial in JavaScript");
    const session = {
      id: `session-${Date.now()}`,
      turns: [firstTurn],
    };
    setBattleData(session);
    setHistory((prev) => [session, ...prev].slice(0, 20));
    setView("battle");
  }, [prompt]);

  const handleFollowUp = useCallback((followUpPrompt) => {
    // Show inline loading or temporary loading screen
    setView("loading");
    setPrompt(followUpPrompt);
  }, []);

  const handleAddFollowUpTurn = useCallback(() => {
    if (!battleData) return;
    const newTurn = generateMockTurn(prompt);
    const updatedSession = {
      ...battleData,
      turns: [...battleData.turns, newTurn],
    };
    setBattleData(updatedSession);

    // Update history entry as well
    setHistory((prev) =>
      prev.map((item) => (item.id === battleData.id ? updatedSession : item)),
    );
    setView("battle");
  }, [battleData, prompt]);

  const handleReset = useCallback(() => {
    setView("home");
    setBattleData(null);
  }, []);

  return (
    <>
      {/* Canvas background */}
      <ParticleBackground />

      {/* Loading Overlay */}
      {view === "loading" && (
        <LoadingScreen
          onComplete={
            battleData ? handleAddFollowUpTurn : handleLoadingComplete
          }
        />
      )}

      {/* Main App */}
      <div style={{ position: "relative", zIndex: 2, minHeight: "100vh" }}>
        <Navbar />

        {view === "home" && (
          <div style={{ animation: "fadeIn 0.4s ease both" }}>
            <HeroSection onBattle={handleBattle} />
          </div>
        )}

        {view === "battle" && battleData && (
          <div style={{ animation: "fadeIn 0.4s ease both" }}>
            {/* Action bar */}
            <div
              style={{
                position: "fixed",
                top: "72px",
                left: 0,
                right: 0,
                zIndex: 50,
                padding: "8px clamp(1rem, 3vw, 2.5rem)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <button
                onClick={handleReset}
                className="action-bar-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  background: "rgba(15,19,33,0.85)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  color: "#bacac5",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  pointerEvents: "all",
                  transition: "all 0.2s ease",
                }}
              >
                ← New Battle
              </button>

              <button
                onClick={() => setSidebarOpen(true)}
                className="action-bar-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  background: "rgba(15,19,33,0.85)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  color: "#bacac5",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  pointerEvents: "all",
                  transition: "all 0.2s ease",
                }}
              >
                ▤ Command Center
              </button>
            </div>

            <div style={{ paddingTop: "48px" }}>
              <BattleScreen data={battleData} onFollowUp={handleFollowUp} />
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        battleData={battleData}
        history={history}
      />
    </>
  );
}
