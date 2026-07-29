import { useState } from 'react';

function SidebarSection({ icon, title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: '6px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="sidebar-section-btn"
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderRadius: '10px', transition: 'background 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>{icon}</span>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600, fontSize: '0.8rem', color: '#bacac5', letterSpacing: '-0.01em',
          }}>
            {title}
          </span>
        </div>
        <span style={{
          color: '#859490', fontSize: '12px',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          display: 'inline-block',
        }}>›</span>
      </button>
      <div style={{
        maxHeight: open ? '400px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
        padding: open ? '0 6px 6px' : '0 6px',
      }}>
        {children}
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose, battleData, history }) {
  const handleExportJSON = () => {
    if (!battleData) return;
    const blob = new Blob([JSON.stringify(battleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `battle-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!battleData || !battleData.turns) return;
    let md = `# AI Battle Arena — Conversation Report\n\n`;
    battleData.turns.forEach((turn, idx) => {
      const winner = turn.judge.solution_1_score >= turn.judge.solution_2_score ? 'Gemini' : 'GPT';
      md += `## Round ${idx + 1}: ${turn.problem}\n\n`;
      md += `### Solution 1 (Gemini) — Score: ${turn.judge.solution_1_score}/10\n${turn.solution_1}\n\n`;
      md += `### Solution 2 (GPT) — Score: ${turn.judge.solution_2_score}/10\n${turn.solution_2}\n\n`;
      md += `### Judge Verdict\n**Winner: ${winner}**\n\n`;
      md += `#### Gemini Reasoning:\n${turn.judge.solution_1_reasoning}\n\n`;
      md += `#### GPT Reasoning:\n${turn.judge.solution_2_reasoning}\n\n`;
      md += `---\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `battle-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(5, 8, 22, 0.6)',
          zIndex: 299,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: '300px',
        zIndex: 300,
        background: 'rgba(10, 13, 28, 0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: '0.95rem', color: '#dfe1f6', letterSpacing: '-0.02em',
          }}>
            Command Center
          </span>
          <button
            onClick={onClose}
            className="close-btn"
            style={{
              width: '28px', height: '28px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#859490', fontSize: '16px',
              transition: 'all 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
          <SidebarSection icon="🕒" title="Recent Battles">
            {history.length === 0 ? (
              <div style={{
                padding: '12px', textAlign: 'center',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3c4a46',
              }}>
                No battles yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {history.map((item, i) => (
                  <div key={i} className="history-item" style={{
                    padding: '10px 12px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}>
                    <div style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', color: '#bacac5',
                      marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {item.turns && item.turns[0] ? item.turns[0].problem : 'Empty Battle'}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#859490', display: 'flex', justifyContent: 'space-between' }}>
                      <span>
                        Winner: <span style={{ color: '#2dd4bf' }}>
                          {item.turns && item.turns[0] && item.turns[0].judge.solution_1_score >= item.turns[0].judge.solution_2_score ? 'Gemini' : 'GPT'}
                        </span>
                      </span>
                      <span style={{ opacity: 0.6 }}>
                        {item.turns ? item.turns.length : 0} {item.turns && item.turns.length === 1 ? 'turn' : 'turns'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SidebarSection>

          <SidebarSection icon="🔖" title="Bookmarks">
            <div style={{
              padding: '12px', textAlign: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3c4a46',
            }}>
              No bookmarks yet
            </div>
          </SidebarSection>
        </div>

        {/* Export */}
        {battleData && (
          <div style={{
            padding: '12px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
              color: '#859490', letterSpacing: '0.08em', padding: '0 4px', marginBottom: '4px',
            }}>
              EXPORT
            </div>
            <button
              onClick={handleExportJSON}
              className="export-btn cyan"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px', borderRadius: '12px',
                background: 'rgba(45,212,191,0.05)',
                border: '1px solid rgba(45,212,191,0.15)',
                cursor: 'pointer', width: '100%',
                color: '#2dd4bf',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem', fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
              <span>{ }</span>
              Export as JSON
            </button>
            <button
              onClick={handleExportMarkdown}
              className="export-btn indigo"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px', borderRadius: '12px',
                background: 'rgba(99,102,241,0.05)',
                border: '1px solid rgba(99,102,241,0.15)',
                cursor: 'pointer', width: '100%',
                color: '#6366f1',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem', fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
              <span>↓</span>
              Download Markdown
            </button>
          </div>
        )}
      </div>
    </>
  );
}
