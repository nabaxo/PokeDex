import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

import { Text, View } from '../components/Themed';

import { PokemonDetails } from '../types';
import { styleSheet, ListSeparator } from '../styles';
import { typeColors } from '../constants/Colors';
import { FavoritesContext } from '../contexts';
import ShowDetails from '../components/ShowDetails';

export default function PokeFavorites() {
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const [favList, setFavList] = useState<PokemonDetails[][]>();
  const [isExpanded, setIsExpanded] = useState<number>();

  useFocusEffect(
    useCallback(() => {
      Promise.all<PokemonDetails[]>(favorites.map(async p => {
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${p}`;
        const varieties = await fetch(speciesUrl)
          .then(r => r.json())
          .then(json => {
            return json.varieties.map((v: any) => v.pokemon.name);
          });

        const entries = Promise.all<PokemonDetails>(varieties.map(async (p: string) => {
          const url = `https://pokeapi.co/api/v2/pokemon/${p}`;
          const result = await fetch(url);
          const json = await result.json();
          let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${json.id}.png`;
          if (json.sprites.other['official-artwork'].front_default) {
            imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${json.id}.png`;
          }
          const entry: PokemonDetails = {
            species: json.species.name,
            name: json.name,
            id: +json.id,
            image: imgUrl,
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
          return entry;
        }));
        return [...await entries];
      })).then(arr => setFavList(arr));
    }, [favorites])
  );

  function handlePress(i: number) {
    if (i === isExpanded) {
      setIsExpanded(NaN);
    } else {
      setIsExpanded(i);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {favList && <FlatList style={styles.list} data={favList}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => {
          const pokemon = item[0];
          return (
            <View key={pokemon.id} style={styles.favEntry}>
              <View style={styles.favHeader}>
                <Text style={styles.favHeaderText}>{pokemon.name.toUpperCase()}</Text>
                <TouchableHighlight activeOpacity={0.6} underlayColor='#fff' onPress={() => removeFavorite(pokemon.name)}>
                  <View style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <TouchableOpacity onPress={() => handlePress(pokemon.id)}>
                <View style={styles.shortListSeparator} lightColor="#ddd" darkColor="rgba(255,255,255,0.1)"></View>
                <Image style={styles.favImage} source={{ uri: pokemon.image }} />
                <View style={styles.types}>{pokemon.types.map(t => <Text key={t} style={[styles.type, { backgroundColor: typeColors[t] }]}>{t.toUpperCase()}</Text>)}</View>
              </TouchableOpacity>
              {pokemon.id === isExpanded &&
                <ShowDetails pokemonToShow={pokemon.name} />
              }
            </View>
          );
        }}

      />}
    </View>
  );
}

const styles = StyleSheet.create(styleSheet);
