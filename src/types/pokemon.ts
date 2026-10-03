export type PokemonType = {
  type: {
    name: string
  }
}

export type Pokemon = {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
  }
  types: PokemonType[]
}

export type PokemonListItem = {
  name: string
  url: string
}

export type PokemonListResponse = {
  results: PokemonListItem[]
}