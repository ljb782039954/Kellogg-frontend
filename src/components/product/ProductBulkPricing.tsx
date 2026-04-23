import React from 'react';
import type { BulkPrice } from '../../types/products';

interface ProductBulkPricingProps {
  bulkPrices: BulkPrice[];
  formatPrice: (price: number) => string;
  language: string;
}

export default function ProductBulkPricing({
  bulkPrices,
  formatPrice,
  language
}: ProductBulkPricingProps) {
  if (!bulkPrices || bulkPrices.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
          {language === 'zh' ? '批量阶梯价格' : 'Tiered Bulk Pricing'}
        </span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bulkPrices.map((tier, index) => (
          <div
            key={index}
            className="bg-gray-100/50 border border-gray-200 rounded-xl p-3 text-center hover:border-amber-200 hover:bg-amber-50/10 transition-all group"
          >
            <p className="text-xs font-bold text-gray-400 uppercase mb-1 group-hover:text-amber-600 transition-colors">
              {tier.maxQty
                ? `${tier.minQty}-${tier.maxQty} ${language === 'zh' ? '件' : 'PCS'}`
                : `${tier.minQty}+ ${language === 'zh' ? '件' : 'PCS'}`
              }
            </p>
            <p className="text-sm font-bold text-gray-900">
              {formatPrice(tier.price)}
              <span className="text-xs text-gray-400 ml-0.5 font-normal">/PCS</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
