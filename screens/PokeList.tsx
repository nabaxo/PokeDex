import React, { useContext } from 'react';
import { useCallback, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Text, View } from '../components/Themed';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import { styleSheet, ListSeparator } from '../styles';
import { FavoritesContext } from '../contexts';
import ShowDetails from '../components/ShowDetails';

interface pokeEntry {
  name: string;
  url: string;
}

export default function PokeList() {
  const limit = 19;
  const [offset, setOffset] = useState(0);
  const [pokeList, setPokeList] = useState<pokeEntry[]>();
  const [pokeDetail, setPokeDetails] = useState<string | undefined>();
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);

  const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;

  useFocusEffect(
    useCallback(() => {
      fetch(url)
        .then(r => {
          if (r.ok) {
            return r.json();
          } else {
            throw new Error();
          }
        })
        .then((json) => {
          if (pokeList) {
            setPokeList([...pokeList, ...json.results]);
          } else {
            // setOffset(0);
            setPokeList(json.results);
          }
        });
    }, [offset])
  );

  function loadMore() {
    setTimeout(() => {
      if (offset < 874) {
        setOffset(offset + 19);
      }
    }, 500);
  }

  function handleFavorite(name: string) {
    if (!favorites.includes(name)) {
      addFavorite(name);
    } else {
      removeFavorite(name);
    }
  }

  function handleShowDetails(name: string) {
    if (name !== pokeDetail) {
      setPokeDetails(name);
    } else {
      setPokeDetails(undefined);
    }
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {pokeList &&
        <FlatList style={styles.list} data={pokeList}
          ItemSeparatorComponent={ListSeparator}
          onEndReachedThreshold={.2}
          onEndReached={loadMore}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item: pokemon }) => {
            const dexNumber = +pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');
            return (
              <View key={dexNumber} style={{ flexDirection: 'column' }}>
                <View style={styles.listEntry}>
                  <TouchableOpacity onPress={() => handleShowDetails(pokemon.name)} style={[styles.listEntry, { minWidth: '85%' }]} >
                    <Image style={styles.sprite} source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexNumber}.png` }} />
                    <Text style={styles.listText} >
                      {dexNumber + '. ' + capitalizeFirstLetter(pokemon.name)}
                    </Text>
                  </TouchableOpacity>
                  <Text onPress={() => handleFavorite(pokemon.name)} style={styles.star}>{favorites.includes(pokemon.name) ? '★' : '☆'}</Text>
                </View>
                {pokeDetail === pokemon.name && (
                  <ShowDetails pokemonToShow={pokemon.name} />
                )}
              </View>
            );
          }}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create(styleSheet);
