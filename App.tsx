import { StatusBar } from 'expo-status-bar';
import React, { createContext, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { FavoritesContext } from './contexts';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [favorites, setFavorites] = useState<string[]>(['']);

  function addFavorite(pokemon: string) {
    if (!favorites.includes(pokemon)) {
      setFavorites([...favorites, pokemon]);
    }
  }
  function removeFavorite(pokemon: string) {
    if (favorites.includes(pokemon)) {
      setFavorites(favorites.filter(p => p !== pokemon));
    }
  }

  const value = { favorites, addFavorite, removeFavorite };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <FavoritesContext.Provider value={value}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </FavoritesContext.Provider>
    );
  }
}
