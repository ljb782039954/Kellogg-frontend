import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Star,
  //  ShoppingBag, Truck, ShieldCheck, RefreshCw, 
  Layers, Calendar, ArrowRight, Share2, Loader2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCurrency } from '../context/CurrencyContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();

  const { product, relatedProducts, loading } = useProductDetail(id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleProductShare = () => {
    const url = window.location.href;
    const title = product?.name?.[language as 'zh' | 'en'] || 'Product';

    if (navigator.share) {
      navigator.share({
        title,
        url,
      }).catch(() => copyToClipboard(url));
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(language === 'zh' ? '商品链接已复制' : 'Product link copied');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-40 pb-20 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-200 mb-4" />
          <p className="text-gray-400 capitalize tracking-widest text-xs font-bold">
            {language === 'zh' ? '加载中...' : 'Loading Details...'}
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-40 pb-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {language === 'zh' ? '抱歉，未找到该商品' : 'Sorry, product not found'}
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="text-gray-900 font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all uppercase tracking-tighter"
          >
            <ChevronLeft className="w-5 h-5" />
            {language === 'zh' ? '返回全部商品' : 'Back to all products'}
          </button>
        </div>
      </div>
    );
  }

  // Gallery images (use detail images if available, otherwise fallback to main image)
  const gallery = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  return (
    <div className="min-h-screen bg-white">

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-gray-900">{language === 'zh' ? '首页' : 'Home'}</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gray-900">{language === 'zh' ? '全部商品' : 'Products'}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name?.[language] || 'Product'}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            {/* Left: Gallery */}
            <div className="space-y-6">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={gallery[activeImageIndex]}
                    src={gallery[activeImageIndex]}
                    alt={product.name?.[language]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {product.tag && product.tag[language] && (
                  <span className="absolute top-6 left-6 px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full tracking-wider uppercase">
                    {product.tag[language]}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 aspect-square rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-gray-900' : 'border-transparent hover:border-gray-200'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col">
              <div className="flex-1 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wide">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold text-gray-900">{product.rating || '5.0'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <h1 className="
                    text-4xl md:text-5xl font-bold text-gray-900 
                    leading-relaxed
                    ">
                      {product.name?.[language]}
                    </h1>
                    <button
                      onClick={handleProductShare}
                      className="p-3 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
                      title={language === 'zh' ? '分享商品' : 'Share product'}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-4 border-b border-gray-100 pb-8">
                  <span className="text-5xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-2xl text-gray-300 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                <div className="space-y-6">
                  <p className="text-gray-500 leading-relaxed text-lg font-light">
                    {language === 'zh'
                      ? '这款设计完美诠释了极简主义美学。通过高品质面料与立体精剪，为都市生活带来极致舒适与优雅型格。每一个细节都经过反复推敲，只为呈现最纯粹的时尚态度。'
                      : 'This design perfectly interprets the minimalist aesthetic. Through high-quality fabrics and 3D precision tailoring, it brings ultimate comfort and elegant style to urban life.'
                    }
                  </p>

                  <div className="grid grid-cols-2 gap-y-4 pt-4">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">{language === 'zh' ? '商品分类' : 'Category'}</p>
                        <p className="font-bold text-gray-800">
                          {product.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">{language === 'zh' ? '上架日期' : 'Release'}</p>
                        <p className="font-bold text-gray-800">{product.releaseDate || '2024-01-01'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Area */}
                {/* <div className="pt-8 space-y-4">
                  <button className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95">
                    <ShoppingBag className="w-6 h-6" />
                    {language === 'zh' ? '立即购买' : 'Shop Now'}
                  </button>
                  <p className="text-center text-sm text-gray-400 flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> {language === 'zh' ? '顺丰包邮' : 'Free Shipping'}</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> {language === 'zh' ? '正品保证' : 'Auth Check'}</span>
                    <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4" /> {language === 'zh' ? '7天不放退换' : '7 Days Return'}</span>
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Recommended Section (Simplified) */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{language === 'zh' ? '猜你喜欢' : 'Related Pieces'}</h2>
              <p className="text-gray-500 mt-2">{language === 'zh' ? '根据你的风格为您推荐' : 'Selected items based on your style'}</p>
            </div>
            <Link to="/products" className="text-gray-900 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              {language === 'zh' ? '查看全部' : 'View All'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(item => (
              <Link to={`/product/${item.id}`} key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={item.image} alt={item.name[language as 'zh' | 'en']} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 line-clamp-1">{item.name[language as 'zh' | 'en']}</h4>
                  <p className="text-gray-900 font-bold mt-1">{formatPrice(item.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
