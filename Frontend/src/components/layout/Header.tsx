import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';

export function Header() {
  const { favoritesCount } = useFavoritesContext();
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Tous les biens', icon: Home },
    { to: '/favorites', label: 'Mes Favoris', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 size={20} className="text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">ImmoFavoris</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            const showBadge = to === '/favorites' && favoritesCount > 0;

            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
                
                {/* Favorites Badge */}
                <AnimatePresence>
                  {showBadge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={cn(
                        'absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold',
                        isActive
                          ? 'bg-card text-primary'
                          : 'bg-favorite text-favorite-foreground'
                      )}
                    >
                      {favoritesCount > 99 ? '99+' : favoritesCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
