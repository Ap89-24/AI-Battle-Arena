import { useEffect, useState } from 'react';

const STEPS = [
  { id: 1, label: 'Preparing Arena', icon: '⚡', color: '#2dd4bf' },
  { id: 2, label: 'Calling Models', icon: '🤖', color: '#6366f1' },
  { id: 3, label: 'Generating Responses', icon: '💬', color: '#a855f7' },
  { id: 4, label: 'Judge Thinking', icon: '🧠', color: '#f59e0b' },
  { id: 5, label: 'Winner Announced', icon: '🏆', color: '#4ade80' },
];

export default function LoadingScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < STEPS.length) {
        setCurrentStep(step);
        if (step > 0) setCompleted(prev => [...prev, step - 1]);
        step++;
      } else {
        setCompleted(STEPS.map((_, i) => i));
        clearInterval(interval);
        setTimeout(() => onComplete(), 600);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [onComplete]);

  const getStatus = (idx) => {
    if (completed.includes(idx)) return 'complete';
    if (idx === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5, 8, 22, 0.97)',
      backdropFilter: 'blur(20px)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>
      {/* Spinning rings */}
      <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '3rem' }}>
        <div className="spin-ring" style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#2dd4bf',
          borderRightColor: 'rgba(45,212,191,0.2)',
          animation: 'spinCW 3s linear infinite',
        }} />
        <div className="spin-ring" style={{
          position: 'absolute', inset: '20px',
          borderRadius: '50%',
          border: '2px solid transparent',
          borderBottomColor: '#6366f1',
          borderLeftColor: 'rgba(99,102,241,0.2)',
          animation: 'spinCCW 2s linear infinite',
        }} />
        <div className="spin-ring" style={{
          position: 'absolute', inset: '40px',
          borderRadius: '50%',
          border: '1px solid rgba(168,85,247,0.15)',
          borderTopColor: '#a855f7',
          animation: 'spinCW 4s linear infinite',
        }} />
        {/* Center */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '72px', height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(45,212,191,0.12), rgba(99,102,241,0.12))',
            border: '1px solid rgba(45,212,191,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }}>
            ⚡
          </div>
        </div>
        {/* Orbiting dots */}
        {[0, 120, 240].map((deg, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '200px', height: '200px',
              marginTop: '-100px', marginLeft: '-100px',
              transformOrigin: 'center',
              animation: `spinCW ${3 + i}s linear infinite`,
            }}
          >
            <div style={{
              position: 'absolute',
              top: '2px', left: '50%',
              width: '7px', height: '7px',
              borderRadius: '50%',
              background: ['#2dd4bf', '#6366f1', '#a855f7'][i],
              boxShadow: `0 0 10px ${['#2dd4bf', '#6366f1', '#a855f7'][i]}`,
              marginLeft: '-3.5px',
            }} />
          </div>
        ))}
      </div>

      <h2 style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: '1.4rem',
        letterSpacing: '-0.03em',
        color: '#dfe1f6',
        marginBottom: '2.5rem',
        margin: '0 0 2.5rem',
      }}>
        Initiating Battle Sequence
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        maxWidth: '380px',
        padding: '0 1.5rem',
      }}>
        {STEPS.map((step, idx) => {
          const status = getStatus(idx);
          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '13px 16px',
                borderRadius: '14px',
                background: status === 'active'
                  ? `${step.color}12`
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${status === 'active' ? `${step.color}40` : 'rgba(255,255,255,0.05)'}`,
                opacity: status === 'pending' ? 0.3 : 1,
                transition: 'all 0.4s ease',
              }}
            >
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                background: status === 'complete'
                  ? 'rgba(74,222,128,0.15)'
                  : status === 'active' ? `${step.color}15` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${status === 'complete' ? '#4ade8050' : status === 'active' ? `${step.color}50` : 'rgba(255,255,255,0.07)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px',
                flexShrink: 0,
                transition: 'all 0.3s ease',
              }}>
                {status === 'complete' ? '✓' : step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  color: status === 'complete' ? '#4ade80' : status === 'active' ? step.color : '#859490',
                  transition: 'color 0.3s ease',
                }}>
                  {step.label}
                </span>
              </div>
              {status === 'active' && (
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      style={{
                        width: '3px', height: '14px',
                        borderRadius: '2px',
                        background: step.color,
                        animation: `barBounce 0.8s ease-in-out ${i * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
