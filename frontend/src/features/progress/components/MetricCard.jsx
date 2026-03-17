import { motion } from 'framer-motion';
import Card from '../../../components/ui/Card.jsx';

function MetricCard({ label, value, helperText, accentClassName = 'from-sky-500 to-cyan-400' }) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="relative overflow-hidden space-y-2">
        <div
          className={`absolute inset-x-0 top-0 h-1 rounded-full bg-gradient-to-r ${accentClassName}`}
        />
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="font-display text-4xl text-ink">{value}</p>
        {helperText ? <p className="text-sm text-slate-500">{helperText}</p> : null}
      </Card>
    </motion.div>
  );
}

export default MetricCard;
