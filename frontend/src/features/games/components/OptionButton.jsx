function OptionButton({
  children,
  isSelected = false,
  isCorrect = false,
  isWrong = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const stateClass = isCorrect
    ? 'border-emerald-300 bg-emerald-100 text-emerald-900'
    : isWrong
      ? 'border-rose-300 bg-rose-100 text-rose-900'
      : isSelected
        ? 'border-sky-300 bg-sky-100 text-sky-900'
        : 'border-white/90 bg-white text-slate-700 hover:border-sand hover:bg-amber-50';

  return (
    <button
      className={[
        'w-full rounded-[1.75rem] border-4 px-5 py-4 text-left text-xl font-extrabold leading-8 shadow-md transition',
        'focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-70',
        stateClass,
        className
      ].join(' ')}
      disabled={disabled}
      onClick={onClick}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export default OptionButton;
