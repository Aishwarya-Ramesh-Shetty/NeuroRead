import Card from '../../../components/ui/Card.jsx';
import { gameTypeMeta } from '../../games/utils/gameTypeMeta.js';

function PerformanceBarChart({ data = [] }) {
  const maxValue = Math.max(...data.map((item) => item.averageScore || 0), 100);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-ink">Performance by game</h2>
        <p className="mt-2 text-sm text-slate-500">Average score for each game the student has played.</p>
      </div>
      {data.length ? (
        <div className="space-y-4">
          {data.map((item) => {
            const width = `${((item.averageScore || 0) / maxValue) * 100}%`;
            const accent = gameTypeMeta[item.gameType]?.accent ?? 'from-sky-500 to-cyan-400';

            return (
              <div key={item._id} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-black text-ink">{item.gameName}</p>
                    <p className="text-sm text-slate-500">
                      {item.attempts} attempts • best {item.bestScore}
                    </p>
                  </div>
                  <p className="text-lg font-black text-ink">{Number(item.averageScore.toFixed(2))}</p>
                </div>
                <div className="h-5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${accent}`}
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No game performance data yet.</p>
      )}
    </Card>
  );
}

export default PerformanceBarChart;
