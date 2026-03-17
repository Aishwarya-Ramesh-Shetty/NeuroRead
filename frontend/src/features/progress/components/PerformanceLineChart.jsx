import Card from '../../../components/ui/Card.jsx';

function PerformanceLineChart({ data = [] }) {
  const width = 640;
  const height = 240;
  const padding = 28;

  if (!data.length) {
    return (
      <Card>
        <h2 className="font-display text-2xl text-ink">Improvement over time</h2>
        <p className="mt-4 text-sm text-slate-500">Complete some games to generate the trend line.</p>
      </Card>
    );
  }

  const maxScore = Math.max(...data.map((point) => point.score), 100);
  const minScore = Math.min(...data.map((point) => point.score), 0);
  const range = Math.max(1, maxScore - minScore);
  const points = data.map((point, index) => {
    const x =
      padding + (index * (width - padding * 2)) / Math.max(1, data.length - 1);
    const y = height - padding - ((point.score - minScore) / range) * (height - padding * 2);
    return { ...point, x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-ink">Improvement over time</h2>
        <p className="mt-2 text-sm text-slate-500">
          Score trend across the student&apos;s recent attempts.
        </p>
      </div>
      <div className="overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-sky-50 via-white to-teal-50 p-4">
        <svg className="h-auto w-full" viewBox={`0 0 ${width} ${height}`} role="img">
          <defs>
            <linearGradient id="progress-line-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = height - padding - ((tick - minScore) / range) * (height - padding * 2);

            return (
              <g key={tick}>
                <line stroke="#dbeafe" strokeDasharray="6 6" x1={padding} x2={width - padding} y1={y} y2={y} />
                <text fill="#64748b" fontSize="12" x={0} y={y + 4}>
                  {tick}
                </text>
              </g>
            );
          })}
          <path
            d={path}
            fill="none"
            stroke="url(#progress-line-gradient)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
          />
          {points.map((point, index) => (
            <g key={point._id ?? index}>
              <circle cx={point.x} cy={point.y} fill="#ffffff" r="8" stroke="#0f766e" strokeWidth="4" />
              <text fill="#475569" fontSize="12" textAnchor="middle" x={point.x} y={height - 4}>
                {index + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}

export default PerformanceLineChart;
