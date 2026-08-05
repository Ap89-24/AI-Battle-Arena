import { useState, useCallback } from "react";
import ParticleBackground from "../components/ParticleBackground";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import LoadingScreen from "../components/LoadingScreen";
import BattleScreen from "../components/BattleScreen";
import Sidebar from "../components/Sidebar";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { createChat, followUpChat } from "../services/chat.api";



export default function App() {
  const [view, setView] = useState("home"); // 'home' | 'loading' | 'battle'
  const [battleData, setBattleData] = useState(null); // { id, turns: [...] }
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isSignedIn } = useUser();

  const handleBattle = useCallback(
    (userPrompt) => {
      if (!isSignedIn) {
        return;
      }
      setPrompt(userPrompt);
      setView("loading");
    },
    [isSignedIn],
  );

  const formattedChat = (chat) => ({
    ...chat,
    turns: chat.turns.map((turn) => ({
      problem: turn.prompt,

      solution_1: turn.responses[0]?.response ?? "",

      solution_2: turn.responses[1]?.response ?? "",

      winner: turn.winner,

      judge: {
        solution_1_score: turn.responses[0]?.score ?? 0,
        solution_2_score: turn.responses[1]?.score ?? 0,

        solution_1_reasoning: turn.responses[0]?.reasoning ?? "",

        solution_2_reasoning: turn.responses[1]?.reasoning ?? "",
      },
    })),
  });

  const handleLoadingComplete = useCallback(async () => {
    try {
      const response = await createChat(prompt);

      const formatChat = formattedChat(response.data);

      setBattleData(formatChat);

      setHistory((prev) => [formatChat, ...prev]);
      setView("battle");
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  }, [prompt]);

  const handleAddFollowUpTurn = useCallback(
    async (followUpPrompt) => {
      if (!battleData) return;
      try {
        const response = await followUpChat(battleData._id, followUpPrompt);

        const formattedSession = formattedChat(response.data);
        setBattleData(formattedSession);

        setHistory((prev) =>
          prev.map((item) =>
            item._id === formattedSession._id ? formattedSession : item,
          ),
        );

        setView("battle");
      } catch (error) {
        console.error("Error adding follow-up:", error);
      }
    },
    [battleData],
  );

  const handleReset = useCallback(() => {
    setView("home");
    setBattleData(null);
  }, []);


  const handleOpenBattle = (battle) => {
    setBattleData(battle);
    setView("battle");
    setSidebarOpen(false);
  };
  // console.log("battleData", battleData);
  // console.log("history", history);
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
              <BattleScreen
                data={battleData}
                onFollowUp={handleAddFollowUpTurn}
              />
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
        onSelectBattle={handleOpenBattle}
      />
    </>
  );
}
