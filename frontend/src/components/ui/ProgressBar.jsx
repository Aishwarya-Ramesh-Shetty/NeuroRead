import { motion } from 'framer-motion';

function ProgressBar({
  value,
  label = 'Progress',
  showValue = true,
  colorClassName = 'from-sea to-sand',
  className = ''
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={['space-y-3', className].join(' ')}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-bold tracking-wide text-slate-700">{label}</p>
        {showValue ? <span className="text-lg font-black text-ink">{safeValue}%</span> : null}
      </div>
      <div className="h-5 w-full overflow-hidden rounded-full bg-white/80 shadow-inner ring-2 ring-slate-100">
        <motion.div
          animate={{ width: `${safeValue}%` }}
          className={`h-full rounded-full bg-gradient-to-r ${colorClassName}`}
          initial={{ width: 0 }}
          style={{ width: `${safeValue}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
