import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './App.module.css'
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
    return <p className={styles.status} role="status">Loading Pokémon…</p>
  }

  if (error) {
    return <p className={styles.status} role='alert'>{error}</p>
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
    <main className={styles.page}>
      <p className={styles.eyebrow}>EXPLORE THE ORIGINALS</p>
      <h1>My Pokémon</h1>
      <p className={styles.intro}>Find a familiar favorite or discover your next companion.</p>
      <div className={styles.controls}>
      <div className={styles.searchField}>
      
      <label htmlFor="pokemon-search">Search Pokémon</label>
      <input
        id="pokemon-search"
        type="search"
        placeholder="Try bulbasaur…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      </div>
      <div className={styles.field}>
      <label htmlFor="sort-by">Sort by:</label>
      <select
        id="sort-by"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
      >
        <option value="id">Number</option>
        <option value="name">Name</option>
      </select>

      </div>
      <div className={styles.field}>
      <label htmlFor="sort-order">Order:</label>
      <select
        id="sort-order"
        value={sortOrder}
        onChange={(event) => setSortOrder(event.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      </div>
      </div>
      <p className={styles.resultCount} aria-live="polite">{filteredPokemons.length} Pokémon found</p>
      
      <ul className={styles.list}>
        {sortedPokemons.map((pokemon) => (
          <li key={pokemon.url}>
            <Link to={`/pokemon/${getPokemonId(pokemon.url)}`}>
              <span className={styles.number}>#{String(getPokemonId(pokemon.url)).padStart(3, '0')}</span>
              <span>{pokemon.name}</span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ul>

      {filteredPokemons.length === 0 && <p className={styles.status}>No matching Pokémon. Try another name.</p>}

    </main>
  )
}

export default PokenmonList
