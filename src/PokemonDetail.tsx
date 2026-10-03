import { Link, useParams } from 'react-router-dom'

function PokemonDetail() {
  const { id } = useParams()

  return (
    <main>
      <h1>Pokemon #{id}</h1>
      <Link to="/">Back to list</Link>
    </main>
  )
}

export default PokemonDetail