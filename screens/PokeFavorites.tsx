import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Text, View } from '../components/Themed';

import { styleSheet, ListSeparator } from './styles';
import { FavoritesContext } from '../contexts';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

interface baseStats {
  hp: number;
  attack: number;
  defense: number;
  spAtt: number;
  spDef: number;
  speed: number;
}

interface pokemonDetails {
  species: string;
  name: string;
  id: number;
  image: string;
  types: string[];
  stats: baseStats;
}

interface typeColorsInterface {
  [type: string]: string,
}

export default function PokeFavorites() {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const [favList, setFavList] = useState<pokemonDetails[][]>();
  const [isExpanded, setIsExpanded] = useState<number>();

  const typeColors: typeColorsInterface = {
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
  };


  useFocusEffect(
    useCallback(() => {
      Promise.all<pokemonDetails[]>(favorites.map(async p => {
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${p}`;
        const varieties = await fetch(speciesUrl)
          .then(r => r.json())
          .then(json => {
            return json.varieties.map((v: any) => v.pokemon.name);
          });

        const entries = Promise.all<pokemonDetails>(varieties.map(async (p: string) => {
          const url = `https://pokeapi.co/api/v2/pokemon/${p}`;
          const result = await fetch(url);
          const json = await result.json();
          let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${json.id}.png`;
          if (json.sprites.other['official-artwork'].front_default) {
            imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${json.id}.png`;
          }
          const entry: pokemonDetails = {
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
      <Text style={styles.title}>Your Favorite Pokémon</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {favList && <FlatList style={styles.list} data={favList}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => {
          const pokemon = item[0];
          return (
            <View key={pokemon.id} style={styles.favEntry}>
              <TouchableOpacity onPress={() => handlePress(pokemon.id)}>
                <Text style={styles.favHeader}>{pokemon.name.toUpperCase()}</Text>
                <View style={styles.shortListSeparator} lightColor="#ddd" darkColor="rgba(255,255,255,0.1)"></View>
                <Image style={styles.favImage} source={{ uri: pokemon.image }} />
                <View style={styles.types}>{pokemon.types.map(t => <Text key={t} style={[styles.type, { backgroundColor: typeColors[t] }]}>{t.toUpperCase()} </Text>)}</View>
                {item.length > 1 && (
                  <View style={styles.detailVariationsRow}>
                    {item.map(v => {
                      return (
                        <View key={v.id} style={styles.detailVariationsColumn}>
                          <Image style={styles.detailVariationsImage} source={{ uri: v.image }} />
                          <Text>{v.name.toUpperCase()}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}
                {pokemon.id === isExpanded &&
                  <View style={styles.baseStats}>
                    <Text style={styles.listText}>Base stats:</Text>
                    <View style={styles.baseStatsRow}>
                      <Text style={styles.baseLabel}>HP:</Text>
                      <Text style={styles.baseStat}>{pokemon.stats.hp}</Text>
                      <View style={{ backgroundColor: '#FF0000', flex: 2, alignSelf: 'stretch', maxWidth: pokemon.stats.hp }}></View>
                    </View>
                    <View style={styles.baseStatsRow}>
                      <Text style={styles.baseLabel}>Attack:</Text>
                      <Text style={styles.baseStat}>{pokemon.stats.attack}</Text>
                      <View style={{ backgroundColor: '#F08030', flex: 2, alignSelf: 'stretch', maxWidth: pokemon.stats.attack }}></View>
                    </View>
                    <View style={styles.baseStatsRow}>
                      <Text style={styles.baseLabel}>Defense:</Text>
                      <Text style={styles.baseStat}>{pokemon.stats.defense}</Text>
                      <View style={{ backgroundColor: '#F8D030', flex: 2, alignSelf: 'stretch', maxWidth: pokemon.stats.defense }}></View>
                    </View>
                    <View style={styles.baseStatsRow}>
                      <Text style={styles.baseLabel}>Special Attack:</Text>
                      <Text style={styles.baseStat}>{pokemon.stats.spAtt}</Text>
                      <View style={{ backgroundColor: '#6890F0', flex: 2, alignSelf: 'stretch', maxWidth: pokemon.stats.spAtt }}></View>
                    </View>
                    <View style={styles.baseStatsRow}>
                      <Text style={styles.baseLabel}>Special Defense:</Text>
                      <Text style={styles.baseStat}>{pokemon.stats.spDef}</Text>
                      <View style={{ backgroundColor: '#78C850', flex: 2, alignSelf: 'stretch', maxWidth: pokemon.stats.spDef }}></View>
                    </View>
                    <View style={styles.baseStatsRow}>
                      <Text style={styles.baseLabel}>Speed:</Text>
                      <Text style={styles.baseStat}>{pokemon.stats.speed}</Text>
                      <View style={{ backgroundColor: '#F85888', flex: 2, alignSelf: 'stretch', maxWidth: pokemon.stats.speed }}></View>
                    </View>
                  </View>
                }
              </TouchableOpacity>
            </View>
          );
        }}

      />}
    </View>
  );
}

const styles = StyleSheet.create(styleSheet);
