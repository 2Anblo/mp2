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

type PokenmonListItem = {
  name: string
  url: string
}

type PokenmonListResponse = {
  results: PokenmonListItem[]
}


function App() {
  const [pokemons, setPokemons] = useState<PokenmonListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPokemon() {
      try {
        const response = await axios.get<Pokemon>(
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


  return (
    <main>
      <h1>My pokemons</h1>
      
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.url}>
            {pokemon.name}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
