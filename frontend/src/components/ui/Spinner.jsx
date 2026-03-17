function Spinner() {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-sea border-r-transparent" />
      Loading...
    </div>
  );
}

export default Spinner;
