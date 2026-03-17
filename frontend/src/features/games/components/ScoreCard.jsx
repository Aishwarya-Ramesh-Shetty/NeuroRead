import Card from '../../../components/ui/Card.jsx';

function ScoreCard({
  title = 'Your score',
  score = 0,
  subtitle = 'Keep going, you are making progress.',
  accentClassName = 'from-fuchsia-500 via-rose-500 to-orange-400',
  stats = []
}) {
  return (
    <Card className="overflow-hidden rounded-[2rem] p-0">
      <div className={`bg-gradient-to-r ${accentClassName} px-6 py-7 text-white sm:px-8`}>
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/80">{title}</p>
        <div className="mt-3 flex items-end gap-3">
          <span className="text-6xl font-black leading-none">{score}</span>
          <span className="pb-1 text-2xl font-black">pts</span>
        </div>
        <p className="mt-3 text-lg leading-8 text-white/90">{subtitle}</p>
      </div>
      {stats.length ? (
        <div className="grid gap-3 p-5 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] bg-slate-50 p-4 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-black text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

export default ScoreCard;
