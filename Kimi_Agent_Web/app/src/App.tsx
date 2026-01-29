import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Authors from './pages/Authors';
import Database from './pages/Database';
import GIS from './pages/GIS';
import ResourceDetail from './pages/ResourceDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-mq-paper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/database" element={<Database />} />
          <Route path="/database/:id" element={<ResourceDetail />} />
          <Route path="/gis" element={<GIS />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
