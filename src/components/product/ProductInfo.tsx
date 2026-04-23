import { Star, Share2 } from 'lucide-react';

interface ProductInfoProps {
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  formatPrice: (price: number) => string;
  onShare: () => void;
  language: string;
}

export default function ProductInfo({
  name,
  price,
  originalPrice,
  category,
  rating,
  formatPrice,
  onShare,
  language
}: ProductInfoProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wide">
            {category}
          </span>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold text-gray-900">{rating || '5.0'}</span>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-relaxed">
            {name}
          </h1>
          <button
            onClick={onShare}
            className="p-3 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
            title={language === 'zh' ? '分享商品' : 'Share product'}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-baseline gap-4 border-b border-gray-100 pb-8">
        <span className="text-5xl font-bold text-gray-900">{formatPrice(price)}</span>
        {originalPrice && (
          <span className="text-2xl text-gray-300 line-through">{formatPrice(originalPrice)}</span>
        )}
      </div>
    </div>
  );
}
