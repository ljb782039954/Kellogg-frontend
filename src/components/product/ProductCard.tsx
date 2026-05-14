import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $currency, $rates, formatPrice } from '../../lib/currency';
import { t } from '../../utils/common';
import OptimizedImage from '../ui/OptimizedImage';
import type { Product, Language } from '../../types';

interface Props {
    product: Product;
    index?: number;
    lang: Language;
}

export default function ProductCard({
    product,
    index = 0,
    lang,
}: Props) {
    const [hasMounted, setHasMounted] = React.useState(false);
    const currency = useStore($currency);
    const rates = useStore($rates);
    
    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    const bulkPrice = product.bulkPrices?.[0];

    // Hydration 兼容处理：挂载前（SSR阶段）始终显示原币种或底价
    const displayPrice = hasMounted 
        ? formatPrice(bulkPrice?.price, currency, rates)
        : formatPrice(bulkPrice?.price);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group h-full flex flex-col"
        >
            <div className="aspect-[3/4] overflow-hidden relative bg-gray-50">
                {product.image ? (
                    <OptimizedImage
                        src={product.image}
                        alt={t(product.name, lang)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        responsive={{
                            sm: 200,
                            md: 320,
                            lg: 400
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Image
                    </div>
                )}
                {product.tag && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-sm z-10">
                        {t(product.tag, lang)}
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                    {t(product.name, lang)}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                    {bulkPrice && (
                      <>
                        <p className="text-xs md:text-sm font-semibold text-gray-400 uppercase group-hover:text-amber-600 transition-colors">
                            {bulkPrice.maxQty
                                ? `${bulkPrice.minQty}-${bulkPrice.maxQty} PCS`
                                : `${bulkPrice.minQty}+ PCS`
                            }
                        </p>
                        <p className="text-sm md:text-base font-bold text-gray-900">
                            {displayPrice}
                        </p>
                      </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
