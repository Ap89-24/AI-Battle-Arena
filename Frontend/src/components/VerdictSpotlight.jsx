import { useState, useEffect, useRef } from 'react';

/* ============================================================
   VerdictSpotlight — Cinematic full-screen winner reveal
   Sequence:
     0.0s  — Dark curtain fades in
     0.4s  — Spotlight beam sweeps down from top
     0.8s  — "JUDGE'S VERDICT" label materialises
     1.2s  — Trophy drops + bounce physics
     1.8s  — Winner name types in character by character
     2.6s  — Score orbs appear with count-up
     3.2s  — Confetti burst
     4.5s  — "Click to continue" prompt
     5.5s  — Auto-dismiss (or click earlier)
   ============================================================ */

function Confetti({ winnerColor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [winnerColor, '#a855f7', '#6366f1', '#f59e0b', '#4ade80', '#ffffff'];
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      w: Math.random() * 10 + 4,
      h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      opacity: 1,
      gravity: 0.06 + Math.random() * 0.04,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allDone = true;
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rot += p.rotSpeed;
        p.opacity = Math.max(0, p.opacity - 0.004);
        if (p.y < canvas.height + 20) allDone = false;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (!allDone) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [winnerColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 10,
      }}
    />
  );
}

function TypedText({ text, startDelay, color, style = {} }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t0);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 55);
    return () => clearTimeout(t);
  }, [started, displayed, text]);

  return (
    <span style={{ color, ...style }}>
      {displayed}
      {displayed.length < text.length && started && (
        <span style={{
          display: 'inline-block',
          width: '2px', height: '1em',
          background: color,
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
          animation: 'pulseDot 0.7s ease-in-out infinite',
        }} />
      )}
    </span>
  );
}

function CountUp({ target, startDelay, color }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const t0 = setTimeout(() => {
      const steps = 30;
      const stepTime = 900 / steps;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setValue(parseFloat((target * (step / steps)).toFixed(1)));
        if (step >= steps) {
          setValue(target);
          clearInterval(interval);
        }
      }, stepTime);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(t0);
  }, [target, startDelay]);

  return (
    <span style={{ color, fontWeight: 700 }}>{value}</span>
  );
}

export default function VerdictSpotlight({ data, onDismiss }) {
 const { judge, winner } = data;

 const isSolution1Winner = winner === "Mistral";

 const winnerName = winner;

 const loserName = winner === "Mistral" ? "Cohere" : "Mistral";

 const winnerScore = isSolution1Winner
   ? judge.solution_1_score
   : judge.solution_2_score;

 const loserScore = isSolution1Winner
   ? judge.solution_2_score
   : judge.solution_1_score;

 const winnerColor = isSolution1Winner ? "#2dd4bf" : "#6366f1";

 const loserColor = isSolution1Winner ? "#6366f1" : "#2dd4bf";

  const [phase, setPhase] = useState(0);
  // phase 0=curtain, 1=spotlight, 2=label, 3=trophy, 4=name, 5=scores, 6=confetti, 7=prompt

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1800),
      setTimeout(() => setPhase(5), 2600),
      setTimeout(() => setPhase(6), 3200),
      setTimeout(() => setPhase(7), 4500),
    ];
    // Auto-dismiss after 7s
    const autoOut = setTimeout(() => onDismiss(), 7500);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(autoOut);
    };
  }, [onDismiss]);

  return (
    <div
      onClick={phase >= 7 ? onDismiss : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
        cursor: phase >= 7 ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
    >
      {/* Dark curtain */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(3, 5, 14, 0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }} />

      {/* Confetti layer */}
      {phase >= 6 && <Confetti winnerColor={winnerColor} />}

      {/* Spotlight beam from top */}
      <div style={{
        position: 'absolute',
        top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '100vh',
        background: `radial-gradient(ellipse 200px 60% at 50% 0%, ${winnerColor}18 0%, transparent 70%)`,
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Side aurora glows */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 60% 40% at 20% 50%, ${winnerColor}06 0%, transparent 70%),
                     radial-gradient(ellipse 60% 40% at 80% 50%, #a855f770 0%, transparent 70%)`,
        opacity: phase >= 2 ? 1 : 0,
        transition: 'opacity 1s ease 0.3s',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '0',
        textAlign: 'center',
        padding: '2rem',
      }}>

        {/* JUDGE'S VERDICT label */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'all 0.6s ease',
          marginBottom: '2rem',
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(10px, 2vw, 13px)',
            fontWeight: 600,
            letterSpacing: '0.35em',
            color: '#859490',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            ─── Judge's Verdict ───
          </div>
          <div style={{
            width: '80px', height: '1px', margin: '0 auto',
            background: `linear-gradient(90deg, transparent, ${winnerColor}, transparent)`,
            opacity: phase >= 3 ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }} />
        </div>

        {/* Trophy */}
        <div style={{
          fontSize: 'clamp(60px, 12vw, 100px)',
          lineHeight: 1,
          marginBottom: '1.5rem',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0) scale(1)' : 'translateY(-80px) scale(0.3)',
          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: phase >= 3
            ? `drop-shadow(0 0 30px ${winnerColor}80) drop-shadow(0 0 60px ${winnerColor}40)`
            : 'none',
          animation: phase >= 3 ? 'trophyFloat 3s ease-in-out infinite' : 'none',
        }}>
          🏆
        </div>

        {/* Winner heading */}
        <div style={{
          marginBottom: '0.5rem',
          minHeight: '80px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {phase >= 4 && (
            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              margin: 0,
            }}>
              <TypedText
                text={winnerName}
                startDelay={0}
                color={winnerColor}
                style={{
                  textShadow: `0 0 40px ${winnerColor}80, 0 0 80px ${winnerColor}40`,
                }}
              />
            </h1>
          )}
        </div>

        {/* "WINS" label */}
        <div style={{
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.4s ease 0.6s',
          marginBottom: '2.5rem',
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(11px, 2vw, 14px)',
            fontWeight: 600,
            letterSpacing: '0.3em',
            color: '#bacac5',
            textTransform: 'uppercase',
          }}>
            takes the crown
          </span>
        </div>

        {/* Score orbs */}
        <div style={{
          display: 'flex', gap: '20px', alignItems: 'center',
          opacity: phase >= 5 ? 1 : 0,
          transform: phase >= 5 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.85)',
          transition: 'all 0.6s cubic-bezier(0.34, 1.2, 0.64, 1)',
          marginBottom: '2.5rem',
        }}>
          {/* Winner score */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px 28px', borderRadius: '20px',
            background: `linear-gradient(135deg, ${winnerColor}15, ${winnerColor}08)`,
            border: `1px solid ${winnerColor}40`,
            boxShadow: `0 0 30px ${winnerColor}20`,
          }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1,
              marginBottom: '4px',
            }}>
              {phase >= 5 && <CountUp target={winnerScore} startDelay={0} color={winnerColor} />}
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px', color: winnerColor, letterSpacing: '0.08em',
            }}>
              {winnerName} — WINNER
            </div>
          </div>

          {/* VS divider */}
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px', color: '#3c4a46',
            letterSpacing: '0.1em',
          }}>VS</div>

          {/* Loser score */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '16px 22px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 700,
              lineHeight: 1, marginBottom: '4px',
            }}>
              {phase >= 5 && <CountUp target={loserScore} startDelay={200} color={loserColor} />}
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px', color: '#859490', letterSpacing: '0.08em',
            }}>
              {loserName}
            </div>
          </div>
        </div>

        {/* Score gap label */}
        {phase >= 5 && (
          <div style={{
            padding: '6px 16px', borderRadius: '12px',
            background: `${winnerColor}10`,
            border: `1px solid ${winnerColor}25`,
            marginBottom: '2rem',
            opacity: phase >= 6 ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px', color: winnerColor, letterSpacing: '0.05em',
            }}>
              +{(winnerScore - loserScore).toFixed(1)} point advantage
            </span>
          </div>
        )}

        {/* Click to continue */}
        <div style={{
          opacity: phase >= 7 ? 1 : 0,
          transform: phase >= 7 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.5s ease',
        }}>
          <div
            onClick={onDismiss}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.85rem', color: '#bacac5', fontWeight: 500,
              transition: 'all 0.2s ease',
              animation: 'pulseDot 2s ease-in-out infinite',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
              e.currentTarget.style.color = '#dfe1f6';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = '#bacac5';
            }}
          >
            <span style={{ animation: 'shimmerBar 1.5s ease-in-out infinite' }}>→</span>
            View Full Analysis
          </div>
        </div>
      </div>

      {/* Bottom scan line effect */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${winnerColor}60, transparent)`,
        opacity: phase >= 2 ? 1 : 0,
        transition: 'opacity 0.5s ease',
        zIndex: 2,
        boxShadow: `0 0 20px ${winnerColor}40`,
      }} />

      {/* Corner decorations */}
      {['tl', 'tr', 'bl', 'br'].map(pos => (
        <div key={pos} style={{
          position: 'absolute',
          top: pos.startsWith('t') ? '20px' : 'auto',
          bottom: pos.startsWith('b') ? '20px' : 'auto',
          left: pos.endsWith('l') ? '20px' : 'auto',
          right: pos.endsWith('r') ? '20px' : 'auto',
          width: '20px', height: '20px',
          borderTop: pos.startsWith('t') ? `2px solid ${winnerColor}60` : 'none',
          borderBottom: pos.startsWith('b') ? `2px solid ${winnerColor}60` : 'none',
          borderLeft: pos.endsWith('l') ? `2px solid ${winnerColor}60` : 'none',
          borderRight: pos.endsWith('r') ? `2px solid ${winnerColor}60` : 'none',
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 0.6s ease 0.2s',
          zIndex: 2,
        }} />
      ))}
    </div>
  );
}
