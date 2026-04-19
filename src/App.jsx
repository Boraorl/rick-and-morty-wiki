import { Route, Routes } from 'react-router-dom';
import BackToTop from './components/BackToTop.jsx';
import DocumentTitle from './components/DocumentTitle.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import CharacterDetailPage from './pages/CharacterDetailPage.jsx';
import CharactersPage from './pages/CharactersPage.jsx';
import EpisodeDetailPage from './pages/EpisodeDetailPage.jsx';
import EpisodesPage from './pages/EpisodesPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import Home from './pages/Home.jsx';
import LocationDetailPage from './pages/LocationDetailPage.jsx';
import LocationsPage from './pages/LocationsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import RickMortyChatBot from './components/RickMortyChatBot.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col cosmic-bg overflow-x-hidden w-full max-w-[100vw]">
      <DocumentTitle />
      <ScrollToTop />
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 relative w-full min-w-0" tabIndex={-1}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/characters/:id" element={<CharacterDetailPage />} />
            <Route path="/episodes" element={<EpisodesPage />} />
            <Route path="/episodes/:id" element={<EpisodeDetailPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/locations/:id" element={<LocationDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
      <RickMortyChatBot />
    </div>
  );
}
