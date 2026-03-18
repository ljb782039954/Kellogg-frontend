import Header from '../components/Header';
import Carousel from '../components/Carousel';
import BrandValues from '../components/BrandValues';
import Statistics from '../components/Statistics';
import Testimonials from '../components/Testimonials';
import ProductList from '../components/ProductList';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header theme="light" />

      {/* Carousel */}
      <div className="pt-16 md:pt-20">
        <Carousel theme="light" />
      </div>

      {/* Brand Values */}
      <BrandValues theme="light" />

      {/* Statistics */}
      <Statistics theme="dark" />

      {/* Featured Products */}
      <ProductList theme="light" />

      {/* Testimonials */}
      <Testimonials theme="light" />

      {/* Footer */}
      <Footer theme="light" />
    </div>
  );
}
