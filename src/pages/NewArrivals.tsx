import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

export default function NewArrivals() {
  const { language } = useLanguage();
  const { content, allProducts } = useContent();
  const { newArrivals } = content;

  // Filter and sort products (Auto-show products from last 365 days)
  const sortedProducts = useMemo(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return [...allProducts]
      .filter(p => {
        if (!p.releaseDate) return false;
        return new Date(p.releaseDate) >= oneYearAgo;
      })
      .sort((a, b) => {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return dateB - dateA;
      });
  }, [allProducts]);

  return (
    <div className="min-h-screen bg-white">
      <Header theme="light" />

      <main className="pt-20">
        {/* Modern Hero Section */}
        <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gray-900">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80')] bg-cover bg-center"
          />
          <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium tracking-widest text-sm uppercase">2024 Collection</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
            >
              {newArrivals.title[language]}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light"
            >
              {newArrivals.subtitle[language]}
            </motion.p>
          </div>
        </section>

        {/* Timeline Grid Content */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.1 }}
                className="group"
              >
                <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-6">
                  <img
                    src={product.image}
                    alt={product.name[language]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {product.releaseDate && (
                    <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      {product.releaseDate}
                    </div>
                  )}
                  {product.tag && (
                    <div className="absolute bottom-4 left-4 px-4 py-1.5 bg-amber-500 text-white rounded-full text-xs font-bold shadow-sm">
                      {product.tag[language]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ArrowRight className="w-5 h-5 text-gray-900" />
                    </div>
                  </div>
                </Link>

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {product.name[language]}
                    </h3>
                    <span className="text-lg font-medium text-gray-500">¥{product.price}</span>
                  </div>
                  <p className="text-sm text-gray-400 capitalize">
                    {content.products.categories.find(c => c.id === product.category)?.name[language] || product.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="bg-gray-50 py-24 border-t border-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">想要掌握第一时间动向？</h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">订阅我们的邮件列表，在新季系列发布前获得独家预览和邀请。</p>
            <div className="flex max-w-md mx-auto gap-4">
              <input 
                type="email" 
                placeholder="你的邮箱地址" 
                className="flex-1 px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg">
                订阅
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer theme="light" />
    </div>
  );
}
