import Card from '../../../components/ui/Card.jsx';

function ResultSummary({ score, timeTaken, attempts }) {
  const items = [
    { label: 'Score', value: `${score}%` },
    { label: 'Time taken', value: `${timeTaken}s` },
    { label: 'Questions', value: attempts }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="space-y-2">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="font-display text-3xl text-ink">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}

export default ResultSummary;
