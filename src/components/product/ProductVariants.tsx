interface ProductVariantsProps {
  colors?: { name: any; image?: string }[];
  sizes?: { name: string; image?: string }[];
  selectedColorIndex: number | null;
  setSelectedColorIndex: (index: number) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
  setVariantPreviewImage: (image: string | null) => void;
  t: (obj: any) => string;
  language: string;
}

export default function ProductVariants({
  colors,
  sizes,
  selectedColorIndex,
  setSelectedColorIndex,
  selectedSize,
  setSelectedSize,
  setVariantPreviewImage,
  t,
  language
}: ProductVariantsProps) {
  if ((!colors || colors.length === 0) && (!sizes || sizes.length === 0)) return null;

  return (
    <div className="space-y-8 py-8 border-b border-gray-100">
      {/* Color Selector */}
      {colors && colors.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400">
            <span>{language === 'zh' ? '颜色选择' : 'Color Selector'}</span>
            <span className="text-gray-900">
              {selectedColorIndex !== null ? t(colors[selectedColorIndex].name) : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedColorIndex(idx);
                  if (color.image) setVariantPreviewImage(color.image);
                }}
                className={`group relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all p-0.5 ${
                  selectedColorIndex === idx ? 'border-gray-900 scale-110 shadow-lg' : 'border-transparent hover:border-gray-200'
                }`}
                title={t(color.name)}
              >
                {color.image ? (
                  <img src={color.image} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[10px] font-bold text-gray-600">
                    {t(color.name)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes && sizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400">
            <span>{language === 'zh' ? '尺码选择' : 'Size Selection'}</span>
            <span className="text-gray-900">{selectedSize || ''}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSize(size.name);
                  if (size.image) setVariantPreviewImage(size.image);
                }}
                className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                  selectedSize === size.name
                    ? 'bg-gray-900 border-gray-900 text-white shadow-lg scale-105'
                    : 'border-gray-100 text-gray-900 hover:border-gray-200 bg-gray-50/50'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
