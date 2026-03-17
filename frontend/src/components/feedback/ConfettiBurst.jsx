import { useMemo } from 'react';
import { motion } from 'framer-motion';

const colors = ['#06b6d4', '#f59e0b', '#ec4899', '#84cc16', '#8b5cf6', '#f97316'];

function ConfettiBurst({ count = 28 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        color: colors[index % colors.length],
        left: `${(index / count) * 100}%`,
        delay: (index % 8) * 0.06,
        duration: 1.8 + (index % 5) * 0.18,
        x: (index % 2 === 0 ? 1 : -1) * (24 + (index % 6) * 18),
        rotate: index % 2 === 0 ? 220 : -220,
        size: 10 + (index % 4) * 4
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [0, piece.x],
            y: [-10, 220 + piece.id * 2],
            rotate: [0, piece.rotate]
          }}
          className="absolute top-0 rounded-sm"
          initial={{ opacity: 0, x: 0, y: -10, rotate: 0 }}
          style={{
            backgroundColor: piece.color,
            height: piece.size,
            left: piece.left,
            width: Math.max(6, piece.size / 2)
          }}
          transition={{
            delay: piece.delay,
            duration: piece.duration,
            ease: 'easeOut',
            repeat: 1,
            repeatDelay: 0.35
          }}
        />
      ))}
    </div>
  );
}

export default ConfettiBurst;
