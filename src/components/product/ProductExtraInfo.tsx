import { Layers, Calendar } from 'lucide-react';

interface ProductExtraInfoProps {
  description: any;
  category: any;
  releaseDate?: string;
  fabric?: any;
  notes?: any;
  t: (obj: any) => string;
  language: string;
}

export default function ProductExtraInfo({
  description,
  category,
  releaseDate,
  fabric,
  notes,
  t,
  language
}: ProductExtraInfoProps) {

  return (
    <div className="space-y-8 pt-8">
      {/* Description */}
      <p className="text-gray-500 leading-relaxed text-lg font-light">
        {t(description)}
      </p>

      {/* Basic Meta */}
      <div className="grid grid-cols-2 gap-y-4 pt-4 pb-4">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">{language === 'zh' ? '商品分类' : 'Category'}</p>
            <p className="font-bold text-gray-800">{t(category)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">{language === 'zh' ? '上架日期' : 'Release'}</p>
            <p className="font-bold text-gray-800">{releaseDate || '2024-01-01'}</p>
          </div>
        </div>
      </div>

      {/* Fabric & Notes */}
      {(fabric || notes) && (
        <div className="border-t border-gray-100 pt-8 space-y-8">
          {fabric && (
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-900 rounded-full" />
                {language === 'zh' ? '面料说明' : 'Fabric Details'}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                {t(fabric)}
              </p>
            </div>
          )}
          {notes && (
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-900 rounded-full" />
                {language === 'zh' ? '注意事项' : 'Important Notes'}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                {t(notes)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
