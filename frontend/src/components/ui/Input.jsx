function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className={[
          'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition',
          'focus:border-sea focus:ring-4 focus:ring-teal-100',
          error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : '',
          className
        ].join(' ')}
        {...props}
      />
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export default Input;
