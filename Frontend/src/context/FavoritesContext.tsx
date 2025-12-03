import React, { createContext, useContext, ReactNode } from 'react';
import { useFavorites } from '@/hooks/useFavorites';

type FavoritesContextType = ReturnType<typeof useFavorites>;

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favoritesState = useFavorites();

  return (
    <FavoritesContext.Provider value={favoritesState}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
}
