import { motion } from 'framer-motion';
import { 
  // ShoppingBag, 
  // Heart, 
  Star 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

interface ProductListProps {
  theme?: 'light' | 'dark' | 'vintage' | 'street' | 'luxury';
}

export default function ProductList({ 
  theme = 'light',
}: ProductListProps) {
  const { language } = useLanguage();
  const { content } = useContent();
  const { featuredProducts } = content.home;

  const themeStyles = {
    light: {
      bg: 'bg-gray-50',
      title: 'text-gray-800',
      subtitle: 'text-gray-500',
      card: 'bg-white',
      cardBorder: 'border-gray-100',
      name: 'text-gray-800',
      price: 'text-gray-900',
      originalPrice: 'text-gray-400',
      button: 'bg-gray-800 text-white hover:bg-gray-700',
      tag: 'bg-red-500 text-white',
    },
    dark: {
      bg: 'bg-gray-900',
      title: 'text-white',
      subtitle: 'text-gray-400',
      card: 'bg-gray-800',
      cardBorder: 'border-gray-700',
      name: 'text-white',
      price: 'text-white',
      originalPrice: 'text-gray-500',
      button: 'bg-white text-gray-900 hover:bg-gray-100',
      tag: 'bg-red-500 text-white',
    },
    vintage: {
      bg: 'bg-amber-50',
      title: 'text-amber-900',
      subtitle: 'text-amber-600',
      card: 'bg-white',
      cardBorder: 'border-amber-100',
      name: 'text-amber-900',
      price: 'text-amber-800',
      originalPrice: 'text-amber-400',
      button: 'bg-amber-800 text-amber-50 hover:bg-amber-700',
      tag: 'bg-amber-600 text-white',
    },
    street: {
      bg: 'bg-gray-900',
      title: 'text-white',
      subtitle: 'text-gray-400',
      card: 'bg-gray-800',
      cardBorder: 'border-purple-500/30',
      name: 'text-white',
      price: 'text-purple-400',
      originalPrice: 'text-gray-500',
      button: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      tag: 'bg-pink-500 text-white',
    },
    luxury: {
      bg: 'bg-black',
      title: 'text-amber-100',
      subtitle: 'text-amber-400',
      card: 'bg-gray-900',
      cardBorder: 'border-amber-500/30',
      name: 'text-amber-100',
      price: 'text-amber-400',
      originalPrice: 'text-gray-500',
      button: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black',
      tag: 'bg-amber-500 text-black',
    },
  };

  const style = themeStyles[theme];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="products" className={`py-16 md:py-24 ${style.bg}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${style.title}`}>
            {featuredProducts.title[language]}
          </h2>
          <p className={`text-lg ${style.subtitle}`}>
            {featuredProducts.subtitle[language]}
          </p>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {featuredProducts.items.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className={`group relative rounded-xl overflow-hidden border ${style.cardBorder} ${style.card} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Tag */}
              {product.tag && (
                <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full z-10 ${style.tag}`}>
                  {product.tag[language]}
                </span>
              )}

              {/* Wishlist Button */}
              {/* <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-50">
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
              </button> */}

              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name[language]}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className={`font-medium text-sm md:text-base mb-2 line-clamp-2 ${style.name}`}>
                  {product.name[language]}
                </h3>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className={`text-sm ${style.subtitle}`}>
                      {product.rating}
                    </span>
                    {product.sales && (
                      <span className={`text-xs ${style.subtitle}`}>
                        ({product.sales} sold)
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-lg font-bold ${style.price}`}>
                    ¥{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className={`text-sm line-through ${style.originalPrice}`}>
                      ¥{product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                {/* <button className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all hover:scale-105 ${style.button}`}>
                  <ShoppingBag className="w-4 h-4" />
                  {language === 'zh' ? '加入购物车' : 'Add to Cart'}
                </button> */}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
