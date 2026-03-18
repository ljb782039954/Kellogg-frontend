import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ContentProvider } from './context/ContentContext';

// Frontend Pages
import Home from './pages/Home.tsx';
import NewArrivals from './pages/NewArrivals';
import Products from './pages/Products';
import Factory from './pages/Factory';
import FAQ from './pages/FAQ';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <Router>
          <Routes>
            {/* Frontend Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/factory" element={<Factory />} />
            <Route path="/faq" element={<FAQ />} />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ContentProvider>
    </LanguageProvider>
  );
}

export default App;
