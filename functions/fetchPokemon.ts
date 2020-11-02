import { PokemonDetails } from '../types';

export default async function fetchPokemon(pokemon: string) {
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemon}`;
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
            abilities: json.abilities.map((a: any) => a.ability.name),
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
