
interface ProductCustomFieldsProps {
  customFields?: { name: any; value: any }[];
  t: (obj: any) => string;
}

export default function ProductCustomFields({
  customFields,
  t,
}: ProductCustomFieldsProps) {

  return (
    <div className="space-y-8 pt-8">
      {/* Custom Fields */}
      {customFields && customFields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16 pt-6 border-t border-gray-100">
          {customFields.map((field, idx) => {
            const value = t(field.value);
            // 匹配双正斜杠 // 或双反斜杠 \\ 进行拆分
            const parts = value.split(/\/\/|\\\\/).map(p => p.trim()).filter(p => p !== '');

            return (
              <div key={idx} className="flex flex-col gap-1 ">
                <p className="text-sm text-gray-500 uppercase font-bold">{idx + 1}:{t(field.name)}</p>

                {parts.length > 1 ? (
                  <ul className="space-y-1.5 mt-1">
                    {parts.map((part, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                        <span className="text-gray-900 font-black text-lg -mt-1">·</span>
                        <span>{part}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <li className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                    <span className="text-gray-900 font-black text-lg -mt-1">·</span>
                    <p className="text-gray-600">{value}</p>
                  </li>
                )}
              </div>
            );

          })}
        </div>
      )}
    </div>
  );
}
