import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

type Pokemon = {
  id: number
  name: string
  sprites: {
    front_default: string | null
  }
}


function App() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPokemon() {
      try {
        const response = await axios.get<Pokemon>(
          'https://pokeapi.co/api/v2/pokemon/pikachu',
          { signal: controller.signal },
        )

        setPokemon(response.data)
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

  if (!pokemon){
    return <p>Pokenmon not found!</p>
  }

  return (
    <main>
      <h1>My pokemons</h1>
      <h2>
        #{pokemon.id} {pokemon.name}
      </h2>

      {pokemon.sprites.front_default && (
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={200}
          height={200}
        />
      )}
    </main>
  )
}

export default App
