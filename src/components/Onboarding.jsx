import { useEffect, useState } from 'react';

const STORAGE_KEY = 'arcane.onboardingSeen';

const STEPS = [
  {
    eyebrow: 'Chapter I',
    title: 'The Hall of Arcanum',
    icon: '✦',
    visual: 'sigil',
    body: 'You stand at the doorway of the alchemists\' guild. To claim your seat among the masters, you must learn the essences and earn fifteen marks of prestige.',
  },
  {
    eyebrow: 'Chapter II · Your Turn',
    title: 'Gather the Essences',
    icon: '◆',
    visual: 'gems',
    body: 'Each turn, take three different essences from the bank — or two of the same color if four or more remain. Hold no more than ten at a time.',
  },
  {
    eyebrow: 'Chapter III · Your Turn',
    title: 'Craft the Reagents',
    icon: '⊟',
    visual: 'reagent',
    body: 'Spend essences to acquire a reagent. Each one grants a permanent discount on future purchases, and many bear marks of prestige.',
  },
  {
    eyebrow: 'Chapter IV · Your Turn',
    title: 'Reserve & the Wild Aurum',
    icon: '⊞',
    visual: 'aurum',
    body: 'Set aside a reagent for later — you receive an aurum, a wild essence that counts as any color. Reserve up to three at once.',
  },
  {
    eyebrow: 'Chapter V',
    title: 'Earn the Archmages\' Favor',
    icon: '♛',
    visual: 'archmage',
    body: 'When your reagents match an archmage\'s tastes, they visit your workshop unbidden — bestowing three prestige each. Their favor is automatic.',
  },
  {
    eyebrow: 'Chapter VI · Victory',
    title: 'The Path to Fifteen',
    icon: '⚡',
    visual: 'victory',
    body: 'First to fifteen prestige triggers the final round. When every player has taken an equal number of turns, the highest score wins. Begin your craft.',
  },
];

export default function Onboarding({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState('forward');

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const goToStep = (next) => {
    if (next < 0 || next >= STEPS.length || next === step) return;
    setDirection(next > step ? 'forward' : 'back');
    setStep(next);
  };

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setStep(0);
    setDirection('forward');
    onClose();
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToStep(step - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (step < STEPS.length - 1) goToStep(step + 1);
        else finish();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (step < STEPS.length - 1) goToStep(step + 1);
        else finish();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  if (!open) return null;

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, rgba(20,12,40,0.7) 0%, rgba(6,4,14,0.92) 70%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: 16,
        animation: 'fade-in 240ms ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'linear-gradient(155deg, #1a1432 0%, #0b0918 100%)',
          border: '1px solid rgba(240,200,64,0.32)',
          borderRadius: 'var(--r-xl)',
          padding: '28px 26px 22px',
          position: 'relative',
          boxShadow: '0 28px 80px rgba(0,0,0,0.65), 0 0 60px rgba(240,200,64,0.10), var(--glass-highlight)',
          animation: 'pi var(--dur-slow) var(--ease-out)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 28,
            right: 28,
            height: 2,
            background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
            opacity: 0.7,
          }}
        />

        <button
          onClick={finish}
          style={{
            position: 'absolute',
            top: 12,
            right: 14,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            padding: 6,
          }}
        >
          SKIP ✕
        </button>

        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 22, marginTop: 8 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => goToStep(i)}
              style={{
                width: i === step ? 22 : 6,
                height: 5,
                borderRadius: 3,
                background: i === step ? 'var(--accent-gold)' : i < step ? 'rgba(240,200,64,0.45)' : 'rgba(240,200,64,0.15)',
                transition: 'all var(--dur-base) var(--ease-out)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        <div
          key={step}
          style={{
            animation: `${direction === 'back' ? 'step-in-left' : 'step-in-right'} 280ms var(--ease-out)`,
          }}
        >
          <div
            style={{
              color: 'rgba(240,200,64,0.55)',
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 3,
              textAlign: 'center',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {s.eyebrow}
          </div>

          <div
            style={{
              fontSize: 54,
              textAlign: 'center',
              color: 'var(--accent-gold)',
              lineHeight: 1,
              marginBottom: 14,
              animation: 'sh 3s ease-in-out infinite',
              filter: 'drop-shadow(0 0 14px rgba(240,200,64,0.45))',
            }}
          >
            {s.icon}
          </div>

          <StepVisual kind={s.visual} />

          <h2
            style={{
              color: 'var(--accent-gold)',
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: 0.5,
              textAlign: 'center',
              margin: '0 0 12px 0',
              lineHeight: 1.2,
            }}
          >
            {s.title}
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontSize: 13.5,
              lineHeight: 1.65,
              textAlign: 'center',
              margin: '0 auto 24px',
              maxWidth: 340,
            }}
          >
            {s.body}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={() => goToStep(step - 1)} disabled={step === 0} style={btnSecondary(step === 0)}>
            ← BACK
          </button>
          <button onClick={isLast ? finish : () => goToStep(step + 1)} style={btnPrimary}>
            {isLast ? 'BEGIN  ✦' : 'NEXT  →'}
          </button>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: 14,
            color: 'var(--text-tertiary)',
            fontSize: 10,
            letterSpacing: 2.5,
            fontWeight: 600,
          }}
        >
          {step + 1} / {STEPS.length}
        </div>
      </div>
    </div>
  );
}

const btnPrimary = {
  padding: '12px 26px',
  background: 'linear-gradient(145deg, #f0c840 0%, #b08820 100%)',
  color: '#1a1200',
  border: 'none',
  borderRadius: 'var(--r-md)',
  fontFamily: 'var(--font-ui)',
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: 2.5,
  cursor: 'pointer',
  boxShadow: '0 6px 20px rgba(240,200,64,0.35), inset 0 1px 0 rgba(255,255,255,0.35)',
  transition: 'transform var(--dur-base) var(--ease-out)',
};

const btnSecondary = (disabled) => ({
  padding: '12px 18px',
  background: 'transparent',
  color: disabled ? 'var(--text-tertiary)' : 'var(--text-secondary)',
  border: '1px solid var(--glass-border)',
  borderRadius: 'var(--r-md)',
  fontFamily: 'var(--font-ui)',
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: 2,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.35 : 1,
});

function StepVisual({ kind }) {
  if (kind === 'sigil') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            color: 'rgba(240,200,64,0.55)',
            fontSize: 18,
            letterSpacing: 4,
          }}
        >
          <span>◇</span>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-display)', letterSpacing: 6, color: 'rgba(240,200,64,0.7)' }}>
            ARCANE ESSENCES
          </span>
          <span>◇</span>
        </div>
      </div>
    );
  }

  if (kind === 'gems') {
    const gems = [
      { col: '#f0e6d0', name: 'Quartz' },
      { col: '#6ab4f8', name: 'Azure' },
      { col: '#52cf7a', name: 'Verdant' },
      { col: '#f06060', name: 'Crimson' },
      { col: '#8a6fd0', name: 'Obsidian' },
    ];
    return (
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 18 }}>
        {gems.map((g, i) => (
          <div key={g.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.75), ${g.col} 58%, rgba(0,0,0,0.45))`,
                boxShadow: `0 0 12px ${g.col}99, inset 0 -3px 5px rgba(0,0,0,0.25)`,
                border: '1.5px solid rgba(255,255,255,0.25)',
                animation: `pu ${2 + i * 0.3}s ease-in-out infinite`,
              }}
            />
            <span style={{ fontSize: 8.5, color: 'var(--text-tertiary)', letterSpacing: 1, fontWeight: 600 }}>
              {g.name.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'reagent') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <div
          style={{
            width: 78,
            height: 100,
            borderRadius: 12,
            background: 'linear-gradient(165deg, rgba(240,200,64,0.10) 0%, #05030f 100%)',
            border: '1px solid rgba(240,200,64,0.55)',
            boxShadow: '0 0 18px rgba(240,200,64,0.28), var(--glass-highlight)',
            padding: 8,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 6,
              right: 8,
              color: '#f0c840',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 20,
              lineHeight: 1,
              textShadow: '0 0 10px rgba(240,200,64,0.7)',
            }}
          >
            2
          </div>
          <div
            style={{
              position: 'absolute',
              top: 9,
              left: 8,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 33% 28%, rgba(255,255,255,0.8), #f0c840 55%, #a07800)',
              boxShadow: '0 0 10px #f0c840bb',
              border: '1.5px solid rgba(255,255,255,0.3)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              right: 8,
              display: 'flex',
              gap: 6,
            }}
          >
            <span style={{ color: '#f06060', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-display)' }}>•2</span>
            <span style={{ color: '#6ab4f8', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-display)' }}>•1</span>
            <span style={{ color: '#f0e6d0', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-display)' }}>•1</span>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'aurum') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.9), #f0c840 50%, #8a6500 100%)',
            boxShadow: '0 0 22px rgba(240,200,64,0.7), inset 0 -4px 7px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.45)',
            animation: 'sh 2.4s ease-in-out infinite',
          }}
        />
        <span
          style={{
            color: 'var(--accent-gold)',
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: 3,
            opacity: 0.8,
          }}
        >
          AURUM
        </span>
      </div>
    );
  }

  if (kind === 'archmage') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <div
          style={{
            padding: '10px 14px',
            background: 'linear-gradient(150deg, #221808, #140e04)',
            border: '1px solid rgba(240,200,64,0.55)',
            borderRadius: 12,
            minWidth: 110,
            boxShadow: '0 0 18px rgba(240,200,64,0.22)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>♛</span>
            <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20 }}>
              3
            </span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ color: '#f0e6d0', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-display)' }}>•4</span>
            <span style={{ color: '#f06060', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-display)' }}>•4</span>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'victory') {
    return (
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <span
          style={{
            color: 'var(--accent-gold)',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 64,
            letterSpacing: 2,
            textShadow: '0 0 32px rgba(240,200,64,0.55)',
            lineHeight: 1,
          }}
        >
          15
        </span>
        <div
          style={{
            color: 'rgba(240,200,64,0.6)',
            fontSize: 10,
            letterSpacing: 4,
            fontWeight: 600,
            marginTop: 6,
          }}
        >
          MARKS OF PRESTIGE
        </div>
      </div>
    );
  }

  return null;
}
