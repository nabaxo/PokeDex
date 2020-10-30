import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Text, View } from '../components/Themed';

import { styleSheet, listSeparator } from './styles';
import { FavoritesContext } from '../contexts';

interface baseStats {
  hp: number;
  attack: number;
  defense: number;
  spAtt: number;
  spDef: number;
  speed: number;
}

interface favData {
  name: string;
  id: number;
  sprite: string;
  types: string[];
  stats: baseStats;
}

export default function PokeFavorites() {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const [favList, setFavList] = useState<favData[]>();

  useFocusEffect(
    useCallback(() => {
      Promise.all<favData>(favorites.map(p => {
        const url = `https://pokeapi.co/api/v2/pokemon/${p}`;
        return fetch(url)
          .then(r => r.json())
          .then(json => {
            const entry: favData = {
              name: json.species,
              id: +json.id,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${json.game_indices.id}.png`,
              types: json.types.map((t: any) => t.type.name),
              stats: {
                hp: +json.stats[0].base_stat,
                attack: +json.stats[1].base_stat,
                defense: +json.stats[2].base_stat,
                spAtt: +json.stats[3].base_stat,
                spDef: +json.stats[4].base_stat,
                speed: +json.stats[5].base_stat,
              }
            };
            // console.log('entry', entry);
            return entry;
          });
      })).then(arr => setFavList(arr));
    }, [])
  );

  console.log('list:', favList?.length, favList);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="/screens/TabTwoScreen.js" /> */}
    </View>
  );
}

const styles = StyleSheet.create(styleSheet);
