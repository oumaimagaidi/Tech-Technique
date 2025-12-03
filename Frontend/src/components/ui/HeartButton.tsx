import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeartButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function HeartButton({
  isFavorite,
  onToggle,
  className,
  size = 'md',
}: HeartButtonProps) {
  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        'flex items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors',
        'hover:bg-card shadow-md',
        sizeClasses[size],
        className
      )}
      whileTap={{ scale: 0.9 }}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <motion.div
        animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={iconSizes[size]}
          className={cn(
            'transition-colors duration-200',
            isFavorite
              ? 'fill-favorite text-favorite'
              : 'text-muted-foreground hover:text-favorite'
          )}
        />
      </motion.div>
    </motion.button>
  );
}
