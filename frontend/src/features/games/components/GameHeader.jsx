import ProgressBar from '../../../components/ui/ProgressBar.jsx';

function GameHeader({ title, description, progress }) {
  return (
    <header className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sea">Gameplay</p>
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        <p className="max-w-2xl text-sm text-slate-500">{description}</p>
      </div>
      <ProgressBar value={progress} />
    </header>
  );
}

export default GameHeader;
