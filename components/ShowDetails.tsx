import React, { useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native';

import { Text, View } from './Themed';

import { PokemonDetails } from '../types';
import { typeColors } from '../constants/Colors';
import { styleSheet, ListSeparator } from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface DetailsProps {
    pokemonToShow: string;
}

export default function ShowDetails({ pokemonToShow }: DetailsProps) {
    const [pokemon, setPokemon] = useState<PokemonDetails[]>();
    const [variety, setVariety] = useState<PokemonDetails>();

    useEffect(() => {
        async function fetchPokemon() {
            const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonToShow}`;
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
        }
        fetchPokemon().then(poke => {
            setPokemon(poke);
            setVariety(poke[0]);
        });
    }, [pokemonToShow]);

    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <View>
            {pokemon && pokemon.length > 1 && (
                <View style={styles.detailVariationsRow}>
                    {pokemon.map(v => {
                        return (
                            <TouchableOpacity key={v.id} onPress={() => setVariety(v)}>
                                <View style={styles.detailVariationsColumn}>
                                    <Text style={styles.detailVariationsTitle}>{v.name.toUpperCase()}</Text>
                                    <Image style={styles.detailVariationsImage} source={{ uri: v.image }} />
                                    <View style={styles.types}>{v.types.map(t =>
                                        <Text key={t} style={[styles.typeSmall, { backgroundColor: typeColors[t] }]}>{t.toUpperCase()}</Text>
                                    )}</View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
            <ListSeparator />
            {variety && (
                <View style={styles.baseStats}>
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
