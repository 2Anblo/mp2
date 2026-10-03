import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import PokemonList from './PokemonList'
import PokemonDetail from './PokemonDetail'
import PokemonGallery from './PokemonGallery'
import styles from './App.module.css'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <header className={styles.header}>
      <div className={styles.brand}>Pokedex <span>FIELD GUIDE / 001–020</span></div>
      <nav className={styles.navigation} aria-label="Main navigation">
        <NavLink to="/" end>List</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
      </nav>
      </header>

      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/gallery" element={<PokemonGallery />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App