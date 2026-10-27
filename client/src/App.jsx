import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { Starfield } from './components/Starfield.jsx';
import { Toast } from './components/Toast.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

// Pages
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import PlanetDetail from './pages/PlanetDetail.jsx';
import Gallery from './pages/Gallery.jsx';
import Quiz from './pages/Quiz.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Observatory from './pages/Observatory.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="relative min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
          {/* Layered Cosmic Background */}
          <Starfield />

          {/* Sticky Navigation */}
          <Navbar />

          <ScrollToTop />

          {/* Main Application Routes */}
          <main className="flex-1 relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/explore/:slug" element={<PlanetDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/observatory"
                element={
                  <ProtectedRoute>
                    <Observatory />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Global Floating Toast */}
          <Toast />

          {/* Comprehensive Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
