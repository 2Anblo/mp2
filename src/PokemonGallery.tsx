import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styles from './App.module.css'
import type { PokemonListResponse, Pokemon } from './types/pokemon'



function PokemonGallery() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [selectedType, setSelectedType] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadGallery() {
      try {
        const response = await axios.get<PokemonListResponse>(
          'https://pokeapi.co/api/v2/pokemon?limit=20',
          { signal: controller.signal },
        )

        const details = await Promise.all(
          response.data.results.map((item) =>
            axios.get<Pokemon>(item.url, {
              signal: controller.signal,
            }),
          ),
        )

        setPokemons(details.map((response) => response.data))
      } catch (err) {
        if (!controller.signal.aborted) {
          setError('Failed to load gallery')
          console.error(err)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadGallery()

    return () => controller.abort()
  }, [])

  const availableTypes = [
    ...new Set(
      pokemons.flatMap((pokemon) =>
        pokemon.types.map((entry) => entry.type.name),
      ),
    ),
  ].sort()

  const filteredPokemons = pokemons.filter(
    (pokemon) =>
      selectedType === '' ||
      pokemon.types.some((entry) => entry.type.name === selectedType),
  )

  if (loading) {
    return <p className={styles.status} role="status">Loading gallery…</p>
  }

  if (error) {
    return <p className={styles.status} role="alert">{error}</p>
  }

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>A CLOSER LOOK</p>
      <h1>Pokémon Gallery</h1>
      <p className={styles.intro}>Meet the collection. Filter by type to find your favorites.</p>
      <div className={styles.filter}>

      <label htmlFor="type-filter">Type: </label>
      <select
        id="type-filter"
        value={selectedType}
        onChange={(event) => setSelectedType(event.target.value)}
      >
        <option value="">All types</option>

        {availableTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      </div>
      <p className={styles.resultCount} aria-live="polite">{filteredPokemons.length} Pokémon found</p>

      <div className={styles.gallery}>
        {filteredPokemons.map((pokemon) => (
          <Link
            key={pokemon.id}
            to={`/pokemon/${pokemon.id}`}
            className={styles.card}
          >
            <span className={styles.number}>#{String(pokemon.id).padStart(3, '0')}</span>
            {pokemon.sprites.front_default && (
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                width={120}
                height={120}
              />
            )}

            <h2>{pokemon.name}</h2>

            <p>
              {pokemon.types
                .map((entry) => entry.type.name)
                .join(', ')}
            </p>
          </Link>
        ))}
      </div>

      {filteredPokemons.length === 0 && <p>No matching Pokémon</p>}
    </main>
  )
}

export default PokemonGallery