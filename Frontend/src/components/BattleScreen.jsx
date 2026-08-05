import { useState, useEffect, useRef } from 'react';
import SolutionCard from './SolutionCard';
import JudgeCard from './JudgeCard';
import VerdictSpotlight from './VerdictSpotlight';

// ============================================================
// SingleTurnBlock — Renders a single prompt turn's solution cards & judge
// ============================================================
function SingleTurnBlock({ turn, index }) {
const isModel1Winner = turn.winner === "Mistral";

  return (
    <div
      style={{
        marginBottom: "4rem",
        borderBottom: "1px dashed rgba(255, 255, 255, 0.05)",
        paddingBottom: "3rem",
        animation: "fadeIn 0.6s ease both",
      }}
    >
      {/* Turn Header / Question Tag */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 20px",
            borderRadius: "16px",
            background: "rgba(15, 19, 33, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
            maxWidth: "700px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#a855f7",
              flexShrink: 0,
              boxShadow: "0 0 8px rgba(168,85,247,0.8)",
            }}
          />
          <span
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#bacac5",
            }}
          >
            Round {index + 1}: {turn.problem}
          </span>
        </div>
      </div>

      {/* VS Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {/* Model A */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 20px",
            borderRadius: "14px",
            background: "rgba(45,212,191,0.08)",
            border: "1px solid rgba(45,212,191,0.2)",
          }}
        >
          <span style={{ fontSize: "20px" }}>🤖</span>
          <div>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "9px",
                color: "#859490",
                letterSpacing: "0.08em",
              }}
            >
              MODEL A
            </div>
            <div
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#2dd4bf",
              }}
            >
              {"Mistral"}
            </div>
          </div>
        </div>

        {/* VS Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 16px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))",
            border: "1px solid rgba(99,102,241,0.4)",
          }}
        >
          <span
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VS
          </span>
        </div>

        {/* Model B */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 20px",
            borderRadius: "14px",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <span style={{ fontSize: "20px" }}>🤖</span>
          <div>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "9px",
                color: "#859490",
                letterSpacing: "0.08em",
              }}
            >
              MODEL B
            </div>
            <div
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#6366f1",
              }}
            >
              {"Cohere"}
            </div>
          </div>
        </div>
      </div>

      {/* Solution Cards Wrapper */}
      <div
        className="battle-cards-wrapper"
        style={{
          display: "flex",
          gap: "1.5rem",
          marginBottom: "1.5rem",
          alignItems: "stretch",
        }}
      >
        <div className="battle-card-slot" style={{ flex: 1, minWidth: 0 }}>
          <SolutionCard
            model="Mistral"
            solution={turn.solution_1}
            score={turn.judge.solution_1_score}
            reasoning={turn.judge.solution_1_reasoning}
            color="#2dd4bf"
            isWinner={turn.winner === "Mistral"}
            side="left"
          />
        </div>

        {/* Energy Beam Divider */}
        <div
          className="energy-divider"
          style={{
            width: "2px",
            alignSelf: "stretch",
            minHeight: "100px",
            position: "relative",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "1px",
              background:
                "linear-gradient(180deg, transparent, rgba(99,102,241,0.4) 20%, rgba(168,85,247,0.6) 50%, rgba(99,102,241,0.4) 80%, transparent)",
            }}
          />
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              boxShadow: "0 0 20px rgba(99,102,241,0.6)",
            }}
          >
            ⚡
          </div>
        </div>

        <div className="battle-card-slot" style={{ flex: 1, minWidth: 0 }}>
          <SolutionCard
            model="Cohere"
            solution={turn.solution_2}
            score={turn.judge.solution_2_score}
            reasoning={turn.judge.solution_2_reasoning}
            color="#6366f1"
            isWinner={turn.winner === "Cohere"}
            side="right"
          />
        </div>
      </div>

      {/* Judge Card */}
      <JudgeCard data={turn} />
    </div>
  );
}

// ============================================================
// BattleScreen Component
// ============================================================
export default function BattleScreen({ data, onFollowUp }) {
  const turns = data.turns || [];
  const latestTurn = turns[turns.length - 1];

  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightTurnIndex, setSpotlightTurnIndex] = useState(-1);
  const [followUpText, setFollowUpText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const bottomRef = useRef(null);

  // Trigger spotlight when a new turn is added
  useEffect(() => {
    if (turns.length > 0 && spotlightTurnIndex !== turns.length - 1) {
      setSpotlightTurnIndex(turns.length - 1);
      setShowSpotlight(true);
    }
  }, [turns.length, spotlightTurnIndex]);

  // Scroll to bottom when new turns are dismissed
  useEffect(() => {
    if (!showSpotlight && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showSpotlight]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (followUpText.trim() && onFollowUp) {
      onFollowUp(followUpText.trim());
      setFollowUpText('');
    }
  };

  return (
    <>
      {/* Cinematic verdict overlay for the latest turn */}
      {showSpotlight && latestTurn && (
        <VerdictSpotlight
          data={latestTurn}
          onDismiss={() => setShowSpotlight(false)}
        />
      )}

      {/* Battle content — fades in/out according to spotlight */}
      <div
        style={{
          paddingTop: '80px',
          paddingBottom: '160px',
          paddingLeft: 'clamp(1rem, 3vw, 2.5rem)',
          paddingRight: 'clamp(1rem, 3vw, 2.5rem)',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          opacity: showSpotlight ? 0 : 1,
          transform: showSpotlight ? 'scale(0.98)' : 'scale(1)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          pointerEvents: showSpotlight ? 'none' : 'all',
        }}
      >
        {/* Render all turns in this session */}
        {turns.map((turn, index) => (
          <SingleTurnBlock key={index} turn={turn} index={index} />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Sticky/Floating Bottom follow-up bar */}
      {!showSpotlight && (
        <div style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 100,
          padding: '24px 2rem 32px',
          background: 'linear-gradient(0deg, #050816 50%, transparent 100%)',
          pointerEvents: 'none',
        }}>
          <div style={{
            maxWidth: '760px',
            margin: '0 auto',
            pointerEvents: 'all',
          }}>
            <form onSubmit={handleSubmit} style={{
              position: 'relative',
              borderRadius: '16px',
              background: 'rgba(15, 19, 33, 0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${isInputFocused ? 'rgba(45, 212, 191, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
              boxShadow: isInputFocused 
                ? '0 0 30px rgba(45, 212, 191, 0.15), 0 10px 40px rgba(0,0,0,0.5)'
                : '0 10px 40px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
            }}>
              <input
                type="text"
                value={followUpText}
                onChange={e => setFollowUpText(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Ask a follow-up question to both models..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '12px 16px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.95rem',
                  color: '#dfe1f6',
                  caretColor: '#2dd4bf',
                }}
              />
              <button
                type="submit"
                disabled={!followUpText.trim()}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: followUpText.trim()
                    ? 'linear-gradient(135deg, #2dd4bf 0%, #6366f1 100%)'
                    : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  cursor: followUpText.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: followUpText.trim() ? '#050816' : '#859490',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>⚡</span> Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
