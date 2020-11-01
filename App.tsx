import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { FavoritesContext } from './contexts';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [favorites, setFavorites] = useState<string[]>([]);

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

  async function getData() {
    try {
      const pokemonsInStorage = await AsyncStorage.getItem('@index');
      return pokemonsInStorage !== null ? JSON.parse(pokemonsInStorage) : null;
    } catch (e) {
      alert('Failed to load favorites');
    }
  }

  async function storeData(pokemons: string[]) {
    try {
      await AsyncStorage.setItem('@index', JSON.stringify(pokemons));
    } catch (e) {
      alert('Saving error');
    }
  }

  useEffect(() => {
    getData().then(p => setFavorites(p));
  }, []);

  useEffect(() => {
    storeData(favorites);
  }, [favorites]);

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
