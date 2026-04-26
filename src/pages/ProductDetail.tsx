import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCurrency } from '../context/CurrencyContext';
import ProductVideo from '../components/ProductVideo';

// Sub-components
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductVariants from '../components/product/ProductVariants';
import ProductExtraInfo from '../components/product/ProductExtraInfo';
import ProductCustomFields from '../components/product/ProductCustomFields';
import RelatedProducts from '../components/product/RelatedProducts';
import ProductBulkPricing from '../components/product/ProductBulkPricing';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { formatPrice } = useCurrency();

  const { product, relatedProducts, loading } = useProductDetail(id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [variantPreviewImage, setVariantPreviewImage] = useState<string | null>(null);

  // Helper to get translated text
  const t = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[language] || obj['en'] || '';
  };

  const handleProductShare = () => {
    const url = window.location.href;
    const title = t(product?.name) || 'Product';

    if (navigator.share) {
      navigator.share({ title, url }).catch(() => copyToClipboard(url));
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(language === 'zh' ? '商品链接已复制' : 'Product link copied');
    });
  };

  // Reset variant previews when ID changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize(null);
    setSelectedColorIndex(null);
    setVariantPreviewImage(null);
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-gray-200 mb-4" />
        <p className="text-gray-400 capitalize tracking-widest text-xs font-bold">
          {language === 'zh' ? '加载中...' : 'Loading Details...'}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-40 pb-20 text-center">
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
    );
  }

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];

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
            <span className="text-gray-900 font-medium truncate">{t(product.name)}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            {/* Left: Gallery Component */}
            <ProductGallery
              gallery={gallery}
              activeImageIndex={activeImageIndex}
              setActiveImageIndex={setActiveImageIndex}
              variantPreviewImage={variantPreviewImage}
              productName={t(product.name)}
              tag={t(product.tag)}
            />

            {/* Right: Info Component */}
            <div className="flex flex-col">
              <div className="flex-1">
                <ProductInfo
                  name={t(product.name)}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  category={t(product.category)}
                  rating={product.rating}
                  formatPrice={formatPrice}
                  onShare={handleProductShare}
                  language={language}
                />

                <ProductBulkPricing
                  bulkPrices={product.bulkPrices || []}
                  formatPrice={formatPrice}
                  language={language}
                />

                <ProductVariants
                  colors={product.colors}
                  sizes={product.sizes}
                  selectedColorIndex={selectedColorIndex}
                  setSelectedColorIndex={setSelectedColorIndex}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                  setVariantPreviewImage={setVariantPreviewImage}
                  t={t}
                  language={language}
                />

                <ProductExtraInfo
                  description={product.description}
                  category={product.category}
                  releaseDate={product.releaseDate}
                  fabric={product.fabric}
                  notes={product.notes}
                  t={t}
                  language={language}
                />

              </div>
            </div>
          </div>

          <div className='px-4 py-8 '>

            <ProductCustomFields
              customFields={product.customFields}
              t={t}
            />
          </div>
        </div>
      </main>

      {/* Video Section */}
      {product.videos && product.videos.length > 0 && (
        <section className="bg-white py-20 border-t border-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {language === 'zh' ? '视频展示' : 'Video Showcase'}
                </h2>
                <div className="w-12 h-1 bg-gray-900 mx-auto rounded-full" />
              </div>
              <div className="grid grid-cols-1 gap-12">
                {product.videos.map((vid, idx) => (
                  <ProductVideo key={idx} url={vid} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommendations Component */}
      <RelatedProducts
        products={relatedProducts}
        language={language}
        formatPrice={formatPrice}
        t={t}
      />
    </div>
  );
}
