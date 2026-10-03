import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import PokemonList from './PokemonList'
import PokemonDetail from './PokemonDetail'
import PokemonGallery from './PokemonGallery'
import './App.css'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <nav aria-label="Main navigation">
        <Link to="/">List</Link>
        {' | '}
        <Link to="/gallery">Gallery</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/gallery" element={<PokemonGallery />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App