function EmptyState({ title, description }) {
  return (
    <div className="panel flex min-h-60 flex-col items-center justify-center px-6 text-center">
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <p className="mt-3 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default EmptyState;
