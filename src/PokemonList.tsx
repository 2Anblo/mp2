import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import { Link } from 'react-router-dom'


type PokenmonListItem = {
  name: string
  url: string
}

type PokenmonListResponse = {
  results: PokenmonListItem[]
}

function getPokemonId(url: string): number {
  return Number(url.split('/').filter(Boolean).pop())
}

function PokenmonList() {
  const [pokemons, setPokemons] = useState<PokenmonListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPokemon() {
      try {
        const response = await axios.get<PokenmonListResponse>(
          'https://pokeapi.co/api/v2/pokemon?limit=20',
          { signal: controller.signal },
        )

        setPokemons(response.data.results)
      } catch(err) {
        if(!controller.signal.aborted) {
          setError('Loading error, refresh and try again')
          console.error(err)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadPokemon()

    return () => controller.abort()

  }, [])

  if (loading) {
    return <p>loading...</p>
  }

  if (error) {
    return <p role='alert'>{error}</p>
  }

  const filteredPokemons = pokemons.filter((pokemon) => 
    pokemon.name.toLowerCase().includes(search.trim().toLocaleLowerCase()),
  )

  const sortedPokemons = [...filteredPokemons].sort((a,b) => {
    const comparison = 
      sortBy === 'name'
        ? a.name.localeCompare(b.name)
        : getPokemonId(a.url) - getPokemonId(b.url)

      return sortOrder === 'asc' ? comparison : -comparison
  })

  return (
    <main>
      <h1>My pokemons</h1>
      
      <label htmlFor="pokemon-search">search for pokemon:</label>
      <input
        id="pokemon-search"
        type="search"
        placeholder="enter pokemon's name"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <label htmlFor="sort-by">Sort by:</label>
      <select
        id="sort-by"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
      >
        <option value="id">Number</option>
        <option value="name">Name</option>
      </select>

      <label htmlFor="sort-order">Order:</label>
      <select
        id="sort-order"
        value={sortOrder}
        onChange={(event) => setSortOrder(event.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <p>found {filteredPokemons.length} pokemon</p>
      
      <ul>
        {sortedPokemons.map((pokemon) => (
          <li key={pokemon.url}>
            <Link to={`/pokemon/${getPokemonId(pokemon.url)}`}>
              #{getPokemonId(pokemon.url)} {pokemon.name}
            </Link>
          </li>
        ))}
      </ul>

      {filteredPokemons.length === 0 && <p>no matched pokemon</p>}

    </main>
  )
}

export default PokenmonList
