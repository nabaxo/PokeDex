import { createContext } from 'react';

export const FavoritesContext = createContext<{
    favorites: string[],
    // setFavorites: (v: string[]) => void;
    addFavorite: (name: string) => void,
    removeFavorite: (name: string) => void;
}>({
    favorites: [],
    addFavorite: () => { },
    removeFavorite: () => { }
});
