import { useState, useEffect } from 'react';

function ScoreBar({ label, score, maxScore = 10, color, isWinner, delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth((score / maxScore) * 100), delay);
    return () => clearTimeout(t);
  }, [score, maxScore, delay]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '72px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px', fontWeight: 600,
          color: isWinner ? color : '#859490',
          letterSpacing: '0.05em',
        }}>
          {label}
        </span>
        {isWinner && <span>🏆</span>}
      </div>

      <div style={{
        flex: 1, height: '28px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          borderRadius: '8px',
          background: `linear-gradient(90deg, ${color}bb, ${color})`,
          boxShadow: `0 0 12px ${color}40`,
          transition: `width 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: '40%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmerBar 2.5s ease-in-out infinite',
          }} />
        </div>
      </div>

      <span style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700, fontSize: '1rem',
        color, width: '36px', textAlign: 'right', flexShrink: 0,
        opacity: width > 0 ? 1 : 0,
        transition: 'opacity 0.5s ease 1s',
      }}>
        {score}
      </span>
    </div>
  );
}

function ReasoningPoint({ text, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      display: 'flex', gap: '12px', alignItems: 'flex-start',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-16px)',
      transition: 'all 0.5s ease',
    }}>
      <div style={{
        width: '22px', height: '22px',
        borderRadius: '50%',
        background: 'rgba(45,212,191,0.1)',
        border: '1px solid rgba(45,212,191,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '2px',
        fontSize: '10px',
      }}>
        ›
      </div>
      <p style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '0.875rem', color: '#bacac5',
        lineHeight: 1.65, flex: 1, margin: 0,
      }}>
        {text}
      </p>
    </div>
  );
}

export default function JudgeCard({ data }) {
  const { judge } = data;
  const isGeminiWinner = judge.solution_1_score >= judge.solution_2_score;
  const winnerColor = isGeminiWinner ? '#2dd4bf' : '#6366f1';
  const winnerName = isGeminiWinner ? 'Gemini' : 'GPT';

  const splitReasoning = (text) => {
    const sentences = text.split('. ').filter(Boolean);
    return sentences.length <= 1 ? [text] : sentences.map((s, i) => i < sentences.length - 1 ? s + '.' : s);
  };

  const r1 = splitReasoning(judge.solution_1_reasoning);
  const r2 = splitReasoning(judge.solution_2_reasoning);

  return (
    <div
      className="judge-card"
      style={{
        borderRadius: '24px',
        background: 'rgba(15, 19, 33, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${winnerColor}30`,
        borderTopColor: `${winnerColor}50`,
        overflow: 'hidden',
        boxShadow: `0 0 60px ${winnerColor}12, 0 30px 80px rgba(0,0,0,0.4)`,
        animation: 'slideInUp 0.8s ease 0.4s both',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '22px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: `linear-gradient(90deg, ${winnerColor}08, transparent)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '12px',
            background: `${winnerColor}12`,
            border: `1px solid ${winnerColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px',
          }}>
            🏆
          </div>
          <div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: '1.1rem', color: '#dfe1f6', letterSpacing: '-0.02em',
            }}>
              AI Judge Decision
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px', color: '#859490', letterSpacing: '0.06em', marginTop: '2px',
            }}>
              POWERED BY GEMINI JUDGE
            </div>
          </div>
        </div>

        {/* Winner badge */}
        <div
          className="winner-badge"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 18px', borderRadius: '20px',
            background: `linear-gradient(135deg, ${winnerColor}20, ${winnerColor}10)`,
            border: `1px solid ${winnerColor}40`,
            boxShadow: `0 0 20px ${winnerColor}25`,
            animation: 'winnerPop 0.6s ease 0.8s both',
          }}
        >
          <span style={{ fontSize: '16px' }}>🏆</span>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: '0.9rem', color: winnerColor, letterSpacing: '-0.01em',
          }}>
            Winner: {winnerName}
          </span>
        </div>
      </div>

      {/* Score Bars */}
      <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px', color: '#859490', letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: '16px',
        }}>
          Score Comparison
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ScoreBar label="Gemini" score={judge.solution_1_score} color="#2dd4bf" isWinner={isGeminiWinner} delay={300} />
          <ScoreBar label="GPT" score={judge.solution_2_score} color="#6366f1" isWinner={!isGeminiWinner} delay={600} />
        </div>
      </div>

      {/* Reasoning */}
      <div style={{
        padding: '24px 28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
      }}>
        {/* Gemini reasoning */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#2dd4bf', boxShadow: '0 0 8px rgba(45,212,191,0.6)',
            }} />
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600,
              color: '#2dd4bf', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Gemini Analysis
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {r1.map((point, i) => (
              <ReasoningPoint key={i} text={point} delay={800 + i * 150} />
            ))}
          </div>
        </div>

        {/* GPT reasoning */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#6366f1', boxShadow: '0 0 8px rgba(99,102,241,0.6)',
            }} />
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', fontWeight: 600,
              color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              GPT Analysis
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {r2.map((point, i) => (
              <ReasoningPoint key={i} text={point} delay={1100 + i * 150} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
