import React, { useCallback, useState } from 'react';
import { StyleSheet, Image, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Text, View } from './Themed';

import { PokemonDetails } from '../types';
import { typeColors } from '../constants/Colors';
import { styleSheet, ListSeparator } from '../styles';
import fetchPokemon from '../functions/fetchPokemon';
import { useFocusEffect } from '@react-navigation/native';

interface DetailsProps {
    pokemonToShow: string;
}

export default function ShowDetails({ pokemonToShow }: DetailsProps) {
    const [pokemon, setPokemon] = useState<PokemonDetails[]>();
    const [variety, setVariety] = useState<PokemonDetails>();

    useFocusEffect(
        useCallback(() => {
            fetchPokemon(pokemonToShow).then(poke => {
                setPokemon(poke);
                setVariety(poke[0]);
            });
        }, [pokemonToShow])
    );
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <View>
            {!pokemon && <ActivityIndicator size='large' color='grey' />}
            {pokemon && pokemon.length > 1 && (
                <View style={styles.detailVariationsRow}>
                    {pokemon.map(v => {
                        return (
                            <TouchableOpacity key={v.id} onPress={() => setVariety(v)}>
                                <View style={styles.detailVariationsColumn}>
                                    <Text style={styles.detailVariationsTitle}>{v.name.toUpperCase()}</Text>
                                    <Image style={styles.detailVariationsImage} source={{ uri: v.image }} />
                                    <Text style={styles.typeSmall}>Abilities:</Text>
                                    <View style={styles.types}>{v.abilities.map((a, i) =>
                                        <Text key={a} style={[styles.typeSmall, { borderRadius: 5 }]}>{i + 1}. {capitalizeFirstLetter(a)}</Text>
                                    )}
                                    </View>
                                    <Text style={styles.typeSmall}>Typing:</Text>
                                    <View style={styles.types}>{v.types.map(t =>
                                        <Text key={t} style={[styles.typeSmall, { backgroundColor: typeColors[t] }]}>{t.toUpperCase()}</Text>
                                    )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
            <ListSeparator />
            {variety && (
                <View style={styles.baseStats}>
                    {pokemon && pokemon.length < 2 && (
                        <View>
                            <Text style={styles.typeSmall}>Abilities:</Text>
                            <View style={styles.types}>{variety.abilities.map((a, i) =>
                                <Text key={a} style={styles.typeSmall}>{i + 1}. {capitalizeFirstLetter(a)}</Text>
                            )}
                            </View>
                            <Text style={styles.typeSmall}>Typing:</Text>
                            <View style={[styles.types, { alignSelf: 'center', paddingVertical: 5 }]}>
                                {variety.types.map(t =>
                                    <Text key={t} style={[styles.typeSmall, { backgroundColor: typeColors[t] }]}>
                                        {t.toUpperCase()}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                    <Text style={styles.listText}>{capitalizeFirstLetter(variety.name)} base stats:</Text>
                    <View style={styles.baseStatsRow}>
                        <Text style={styles.baseLabel}>HP:</Text>
                        <Text style={styles.baseStat}>{variety.stats.hp}</Text>
                        <View style={{ backgroundColor: '#FF0000', flex: 2, alignSelf: 'stretch', maxWidth: variety.stats.hp }}></View>
                    </View>
                    <View style={styles.baseStatsRow}>
                        <Text style={styles.baseLabel}>Attack:</Text>
                        <Text style={styles.baseStat}>{variety.stats.attack}</Text>
                        <View style={{ backgroundColor: '#F08030', flex: 2, alignSelf: 'stretch', maxWidth: variety.stats.attack }}></View>
                    </View>
                    <View style={styles.baseStatsRow}>
                        <Text style={styles.baseLabel}>Defense:</Text>
                        <Text style={styles.baseStat}>{variety.stats.defense}</Text>
                        <View style={{ backgroundColor: '#F8D030', flex: 2, alignSelf: 'stretch', maxWidth: variety.stats.defense }}></View>
                    </View>
                    <View style={styles.baseStatsRow}>
                        <Text style={styles.baseLabel}>Special Attack:</Text>
                        <Text style={styles.baseStat}>{variety.stats.spAtt}</Text>
                        <View style={{ backgroundColor: '#6890F0', flex: 2, alignSelf: 'stretch', maxWidth: variety.stats.spAtt }}></View>
                    </View>
                    <View style={styles.baseStatsRow}>
                        <Text style={styles.baseLabel}>Special Defense:</Text>
                        <Text style={styles.baseStat}>{variety.stats.spDef}</Text>
                        <View style={{ backgroundColor: '#78C850', flex: 2, alignSelf: 'stretch', maxWidth: variety.stats.spDef }}></View>
                    </View>
                    <View style={styles.baseStatsRow}>
                        <Text style={styles.baseLabel}>Speed:</Text>
                        <Text style={styles.baseStat}>{variety.stats.speed}</Text>
                        <View style={{ backgroundColor: '#F85888', flex: 2, alignSelf: 'stretch', maxWidth: variety.stats.speed }}></View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create(styleSheet);
