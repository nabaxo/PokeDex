import React, { useContext, useEffect } from 'react';
import { useCallback, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Text, View } from '../components/Themed';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';

import { styleSheet, ListSeparator } from '../styles';
import { FavoritesContext } from '../contexts';
import ShowDetails from '../components/ShowDetails';

interface pokeEntry {
  name: string;
  url: string;
}

export default function PokeList() {
  const [limit, setLimit] = useState(19);
  const [offset, setOffset] = useState(0);
  const [pokeList, setPokeList] = useState<pokeEntry[]>();
  const [pokeDetail, setPokeDetails] = useState<string | undefined>();
  const [query, setQuery] = useState<string>();

  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);


  useFocusEffect(
    useCallback(() => {
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
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

  useEffect(() => {
    if (query) {
      const url = `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`;
      // console.log(url);
      fetch(url)
        .then(r => r.json())
        .then(json => {
          // console.log(json);
          const result: pokeEntry = {
            name: json.name,
            url: `https://pokeapi.co/api/v2/pokemon/${json.id}`
          };
          console.log(result);
          setPokeList([result]);
        }).catch(e => {
          const result: pokeEntry = {
            name: 'Not Found',
            url: ''
          };
          setPokeList([result]);
          console.log(e);
        });
    }
  }, [query]);

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

  function handleSearch(q: string) {
    setQuery(q);
    if (q === '') {
      setOffset(0);
    }
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        onSubmitEditing={event => handleSearch(event.nativeEvent.text)}
        placeholder='Search'
        placeholderTextColor='#333'
        returnKeyType='search'
        clearTextOnFocus
      />
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
        />}
    </View>
  );
}

const styles = StyleSheet.create(styleSheet);
