function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-sea text-white hover:bg-teal-700',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100'
  };

  return (
    <button
      className={[
        'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition',
        'focus:outline-none focus:ring-2 focus:ring-sea/30 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
