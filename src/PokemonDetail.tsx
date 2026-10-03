import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './App.module.css'
import type { Pokemon } from './types/pokemon'



function PokemonDetail() {
  const { id } = useParams()

  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPokemon() {
      setLoading(true)
      setError('')
      setPokemon(null)

      try {
        const response = await axios.get<Pokemon>(
          `https://pokeapi.co/api/v2/pokemon/${id}`,
          { signal: controller.signal },
        )

        setPokemon(response.data)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError('Failed to load Pokémon')
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
  }, [id])

  if (loading) {
    return <p className={styles.status} role="status">Loading Pokémon…</p>
  }

  if (error) {
    return (
      <main className={`${styles.page} ${styles.detail}`}>
        <p role="alert">{error}</p>
        <Link to="/">Back to list</Link>
      </main>
    )
  }

  if (!pokemon) {
    return <p className={styles.status}>No Pokémon found</p>
  }

    const totalPokemon = 20

    const previousId =
    pokemon.id === 1 ? totalPokemon : pokemon.id - 1

    const nextId =
    pokemon.id === totalPokemon ? 1 : pokemon.id + 1

  return (
    <main className={`${styles.page} ${styles.detail}`}>
      <Link to="/">Back to list</Link>

      <h1>
        #{pokemon.id} {pokemon.name}
      </h1>

      {pokemon.sprites.front_default && (
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={200}
          height={200}
        />
      )}

      <p>Height: {pokemon.height / 10} m</p>
      <p>Weight: {pokemon.weight / 10} kg</p>

      <h2>Types</h2>
      <ul className={styles.types}>
        {pokemon.types.map((entry) => (
          <li key={entry.type.name}>{entry.type.name}</li>
        ))}
      </ul>

      <nav className={styles.detailNavigation} aria-label="Pokémon navigation">
            <Link to={`/pokemon/${previousId}`}>
                ← Previous
            </Link>

            {' | '}

            <Link to={`/pokemon/${nextId}`}>
                Next →
            </Link>
        </nav>
    </main>
  )
}

export default PokemonDetail