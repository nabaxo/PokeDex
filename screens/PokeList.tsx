import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Text, View } from '../components/Themed';
import { FlatList } from 'react-native-gesture-handler';


interface pokeEntry {
  name: string;
  url: string;
}

export default function PokeList() {
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [pokeList, setPokeList] = useState<pokeEntry[]>();

  useFocusEffect(
    React.useCallback(() => {
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
      fetch(url)
        .then(r => r.json())
        .then((json) => {
          setPokeList(json.results);
        });
      // console.log(pokeList.results[1].url.replace(/[^0-9]/g, '').substring(1));
      // console.log(pokeList.results);
    }, [pokeList]));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {pokeList &&
        <FlatList style={styles.list} data={pokeList}
          renderItem={({ item }) => <Text
            style={styles.listItem}
            key={item.url.replace(/[^0-9]/g, '').substring(1)}
          >{item.name}
          </Text>}
        />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    paddingTop: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  list: {
    flex: 1,
  },
  listItem: {
    fontSize: 16,
    borderBottomWidth: 1,
    width: '100%',
  }
});
