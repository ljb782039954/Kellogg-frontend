import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface RelatedProductsProps {
  products: any[];
  language: string;
  formatPrice: (price: number) => string;
  t: (obj: any) => string;
}

export default function RelatedProducts({
  products,
  language,
  formatPrice,
  t
}: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'zh' ? '猜你喜欢' : 'Related Pieces'}
            </h2>
            <p className="text-gray-500 mt-2">
              {language === 'zh' ? '根据你的风格为您推荐' : 'Selected items based on your style'}
            </p>
          </div>
          <Link to="/products" className="text-gray-900 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            {language === 'zh' ? '查看全部' : 'View All'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(item => (
            <Link 
              to={`/product/${item.id}`} 
              key={item.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={t(item.name)} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 line-clamp-1">{t(item.name)}</h4>
                <p className="text-gray-900 font-bold mt-1">{formatPrice(item.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
