export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Pokedex: undefined;
  Pokefavs: undefined;
};

export type TabOneParamList = {
  PokedexScreen: undefined;
};

export type TabTwoParamList = {
  PokefavsScreen: undefined;
};

export interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  spAtt: number;
  spDef: number;
  speed: number;
}

export interface PokemonDetails {
  species: string;
  name: string;
  id: number;
  image: string;
  types: string[];
  stats: BaseStats;
}

export interface TypeColorsInterface {
  [type: string]: string,
}
