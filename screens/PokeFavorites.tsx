import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

import { Text, View } from '../components/Themed';

import { PokemonDetails } from '../types';
import { styleSheet, ListSeparator } from '../styles';
import { typeColors } from '../constants/Colors';
import { FavoritesContext } from '../contexts';
import fetchPokemon from '../functions/fetchPokemon';
import ShowDetails from '../components/ShowDetails';

export default function PokeFavorites() {
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const [favList, setFavList] = useState<PokemonDetails[][]>();
  const [isExpanded, setIsExpanded] = useState<number>();

  useFocusEffect(
    useCallback(() => {
      Promise.all<PokemonDetails[]>(favorites.map(async p => {
        return fetchPokemon(p);
      })).then(favPokes => setFavList(favPokes));
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
