import { useState, useEffect } from 'react';

// Score Ring (pure SVG + CSS animation)
function ScoreRing({ score, maxScore = 10, color = '#2dd4bf', size = 72 }) {
  const [animated, setAnimated] = useState(false);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = animated ? (score / maxScore) : 0;
  const dashOffset = circumference * (1 - progress);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
            filter: `drop-shadow(0 0 4px ${color}80)`,
          }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '1px',
      }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: size < 70 ? '0.85rem' : '1rem',
          color, lineHeight: 1,
        }}>
          {score}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '9px', color: '#859490', letterSpacing: '0.03em',
        }}>
          /10
        </span>
      </div>
    </div>
  );
}

// Simple syntax-highlighted code block (no external dep)
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      position: 'relative',
      borderRadius: '10px',
      background: 'rgba(10, 13, 28, 0.9)',
      border: '1px solid rgba(255,255,255,0.07)',
      margin: '0.6rem 0',
      overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: '#859490',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: copied ? '#4ade80' : '#859490',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            transition: 'color 0.2s',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{
        margin: 0,
        padding: '14px 16px',
        overflow: 'auto',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.78rem',
        lineHeight: 1.65,
        color: '#c0c1ff',
        maxHeight: '280px',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Parse markdown into renderable chunks
function parseMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push({ type: 'code', language, content: codeLines.join('\n') });
      i++;
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push({ type: 'h3', content: line.slice(4) });
      i++;
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push({ type: 'h2', content: line.slice(3) });
      i++;
      continue;
    }

    // H1
    if (line.startsWith('# ')) {
      elements.push({ type: 'h1', content: line.slice(2) });
      i++;
      continue;
    }

    // List item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push({ type: 'li', content: line.slice(2) });
      i++;
      continue;
    }

    // Empty line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Paragraph
    elements.push({ type: 'p', content: line });
    i++;
  }

  return elements;
}

function renderInline(text) {
  // Handle **bold** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#dfe1f6', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} style={{
          fontFamily: 'JetBrains Mono, monospace',
          background: 'rgba(45,212,191,0.08)',
          color: '#2dd4bf',
          padding: '1px 5px',
          borderRadius: '4px',
          fontSize: '0.82em',
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function MarkdownRenderer({ content }) {
  const elements = parseMarkdown(content);

  return (
    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', lineHeight: 1.7 }}>
      {elements.map((el, i) => {
        switch (el.type) {
          case 'h1':
            return <h1 key={i} style={{ color: '#dfe1f6', fontWeight: 700, fontSize: '1.2rem', margin: '1rem 0 0.4rem', letterSpacing: '-0.02em' }}>{renderInline(el.content)}</h1>;
          case 'h2':
            return <h2 key={i} style={{ color: '#dfe1f6', fontWeight: 600, fontSize: '1rem', margin: '0.9rem 0 0.4rem', letterSpacing: '-0.01em' }}>{renderInline(el.content)}</h2>;
          case 'h3':
            return <h3 key={i} style={{ color: '#bacac5', fontWeight: 600, fontSize: '0.9rem', margin: '0.75rem 0 0.3rem' }}>{renderInline(el.content)}</h3>;
          case 'p':
            return <p key={i} style={{ color: '#bacac5', marginBottom: '0.5rem' }}>{renderInline(el.content)}</p>;
          case 'li':
            return <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '0.25rem', color: '#bacac5' }}>
              <span style={{ color: '#2dd4bf', flexShrink: 0 }}>•</span>
              <span>{renderInline(el.content)}</span>
            </div>;
          case 'code':
            return <CodeBlock key={i} code={el.content} language={el.language} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

export default function SolutionCard({ model, solution, score, color, isWinner, side }) {
  const glowColor = color === '#2dd4bf' ? 'rgba(45,212,191,0.2)' : 'rgba(99,102,241,0.2)';
  const bgColor = color === '#2dd4bf' ? 'rgba(45,212,191,0.04)' : 'rgba(99,102,241,0.04)';

  return (
    <div
      className={`solution-card card-slide-in-${side}`}
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: 'rgba(15, 19, 33, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${isWinner ? `${color}40` : 'rgba(255,255,255,0.08)'}`,
        borderTopColor: isWinner ? `${color}60` : 'rgba(255,255,255,0.12)',
        boxShadow: isWinner
          ? `0 0 40px ${glowColor}, 0 20px 60px rgba(0,0,0,0.4)`
          : '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        animation: `slideIn${side === 'left' ? 'Left' : 'Right'} 0.7s ease both`,
      }}
    >
      {/* Winner ribbon */}
      {isWinner && (
        <div style={{
          position: 'absolute',
          top: '18px', right: '-28px',
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          color: '#050816',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '9px',
          fontWeight: 600,
          padding: '4px 36px',
          letterSpacing: '0.1em',
          transform: 'rotate(45deg)',
          zIndex: 5,
          boxShadow: `0 4px 15px ${glowColor}`,
        }}>
          WINNER
        </div>
      )}

      {/* Card Header */}
      <div style={{
        padding: '20px 22px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: bgColor,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            background: glowColor,
            border: `1px solid ${color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>
            🤖
          </div>
          <div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600, fontSize: '0.9rem', color: '#dfe1f6',
            }}>
              Solution {side === 'left' ? '1' : '2'}
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px', color, letterSpacing: '0.05em', marginTop: '2px',
            }}>
              {model}
            </div>
          </div>
        </div>
        <ScoreRing score={score} color={color} size={72} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '20px 22px',
        maxHeight: '500px',
      }}>
        <MarkdownRenderer content={solution} />
      </div>
    </div>
  );
}
