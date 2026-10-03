import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'


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
  const [search, setSearch] = useState('')

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

      <p>found {filteredPokemons.length} pokemon</p>
      
      <ul>
        {filteredPokemons.map((pokemon) => (
          <li key={pokemon.url}>
            {pokemon.name}
          </li>
        ))}
      </ul>

      {filteredPokemons.length === 0 && <p>no matched pokemon</p>}

    </main>
  )
}

export default App
