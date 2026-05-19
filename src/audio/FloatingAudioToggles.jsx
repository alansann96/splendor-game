import { useAudio } from './AudioProvider';

const btnStyle = (active) => ({
  border: '1px solid var(--glass-border, #ffffff1f)',
  background: 'var(--glass-bg, #07050daa)',
  color: active ? 'var(--text-secondary, #d8d4e4)' : 'var(--text-tertiary, #9a8ea888)',
  fontSize: 14,
  cursor: 'pointer',
  borderRadius: 6,
  padding: '6px 10px',
  minWidth: 32,
  minHeight: 32,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  opacity: active ? 1 : 0.55,
});

export default function FloatingAudioToggles() {
  const { musicMuted, toggleMusic, sndMuted, toggleSnd } = useAudio();
  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(6px + env(safe-area-inset-top))',
        left: 6,
        display: 'flex',
        gap: 6,
        zIndex: 20,
      }}
    >
      <button
        onClick={toggleMusic}
        aria-label={musicMuted ? 'Play music' : 'Pause music'}
        title={musicMuted ? 'Play music' : 'Pause music'}
        style={btnStyle(!musicMuted)}
      >
        {musicMuted ? '🎵̸' : '🎵'}
      </button>
      <button
        onClick={toggleSnd}
        aria-label={sndMuted ? 'Unmute sound effects' : 'Mute sound effects'}
        title={sndMuted ? 'Unmute sound effects' : 'Mute sound effects'}
        style={btnStyle(!sndMuted)}
      >
        {sndMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
