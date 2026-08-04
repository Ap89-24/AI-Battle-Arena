import { useState, useRef, useEffect } from 'react';
import { useUser, SignInButton } from "@clerk/clerk-react";

export default function HeroSection({ onBattle }) {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef(null);

  const { isSignedIn } = useUser();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim())
    if (!isSignedIn) return;
    
    onBattle(prompt.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const examples = [
    'Implement binary search in Python',
    'Explain quantum entanglement simply',
    'Write a React hook for debounce',
    'Design a REST API for a todo app',
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 2rem 4rem",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Badge */}

      {/* Heading */}
      <div
        className={`fade-slide-up ${mounted ? "visible" : ""}`}
        style={{
          animationDelay: "0.2s",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            margin: 0,
          }}
        >
          <span
            style={{
              background:
                "linear-gradient(135deg, #dfe1f6 0%, #bacac5 40%, #dfe1f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI{" "}
          </span>
          <span
            style={{
              background:
                "linear-gradient(135deg, #2dd4bf 0%, #6366f1 50%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Battle Arena
          </span>
        </h1>
      </div>

      {/* Subtitle */}
      <div
        className={`fade-slide-up ${mounted ? "visible" : ""}`}
        style={{ animationDelay: "0.35s", marginBottom: "3rem" }}
      >
        <p
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            fontWeight: 400,
            color: "#bacac5",
            textAlign: "center",
            maxWidth: "520px",
            lineHeight: 1.65,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Watch AI models compete. Compare responses.{" "}
          <span style={{ color: "#dfe1f6" }}>Let the judge decide.</span>
        </p>
      </div>

      {/* Input */}
      <div
        className={`fade-slide-up ${mounted ? "visible" : ""}`}
        style={{ animationDelay: "0.5s", width: "100%", maxWidth: "760px" }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              position: "relative",
              borderRadius: "20px",
              background: "rgba(15, 19, 33, 0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${isFocused ? "rgba(45, 212, 191, 0.5)" : "rgba(255, 255, 255, 0.08)"}`,
              boxShadow: isFocused
                ? "0 0 0 3px rgba(45, 212, 191, 0.08), 0 0 40px rgba(45, 212, 191, 0.12)"
                : "0 4px 30px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              overflow: "hidden",
            }}
          >
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              style={{
                width: "100%",
                padding: "22px 170px 22px 24px",
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "1.05rem",
                fontWeight: 400,
                color: "#dfe1f6",
                lineHeight: 1.6,
                caretColor: "#2dd4bf",
                minHeight: "64px",
                maxHeight: "200px",
                overflow: "auto",
              }}
            />
            {isSignedIn ? (
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="battle-btn"
                style={{
                  position: "absolute",
                  right: "12px",
                  bottom: "12px",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background: prompt.trim()
                    ? "linear-gradient(135deg, #2dd4bf 0%, #6366f1 100%)"
                    : "rgba(255,255,255,0.06)",
                  border: "none",
                  cursor: prompt.trim() ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: prompt.trim() ? "#050816" : "#859490",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Battle
              </button>
            ) : (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="battle-btn"
                  style={{
                    position: "absolute",
                    right: "12px",
                    bottom: "12px",
                    padding: "10px 20px",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #2dd4bf 0%, #6366f1 100%)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#050816",
                  }}
                >
                  Login to Battle
                </button>
              </SignInButton>
            )}
          </div>
          <div
            style={{
              textAlign: "right",
              marginTop: "8px",
              paddingRight: "4px",
            }}
          >
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "11px",
                color: "#859490",
              }}
            >
              Press{" "}
              <kbd
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  padding: "1px 6px",
                  fontSize: "10px",
                }}
              >
                Enter
              </kbd>{" "}
              to start
            </span>
          </div>
        </form>
      </div>

      {/* Example prompts */}
      <div
        className={`fade-slide-up ${mounted ? "visible" : ""}`}
        style={{
          animationDelay: "0.7s",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
          marginTop: "2.5rem",
          maxWidth: "700px",
        }}
      >
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setPrompt(ex)}
            className="example-chip"
            style={{
              padding: "7px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              background: "rgba(255, 255, 255, 0.03)",
              cursor: "pointer",
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "0.8rem",
              color: "#859490",
              transition: "all 0.2s ease",
              backdropFilter: "blur(10px)",
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
