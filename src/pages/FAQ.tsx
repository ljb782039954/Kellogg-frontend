import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

export default function FAQ() {
  const { language } = useLanguage();
  const { content } = useContent();
  const { faq } = content;

  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = faq.items.filter(
    (item) =>
      item.question[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer[language].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Header theme="light" />

      <div className="pt-20">
        {/* Hero */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {faq.title[language]}
            </h1>
            <p className="text-lg text-gray-500">
              {faq.subtitle[language]}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'zh' ? '搜索问题...' : 'Search questions...'}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="container mx-auto px-4 py-8 pb-20">
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">
                  {language === 'zh' ? '没有找到相关问题' : 'No questions found'}
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-800 pr-4">
                      {item.question[language]}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        openId === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6">
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed pt-4">
                              {item.answer[language]}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>

          {/* Contact CTA */}
          <div className="max-w-3xl mx-auto mt-12 text-center">
            <p className="text-gray-500 mb-4">
              {language === 'zh'
                ? '还有其他问题？'
                : 'Still have questions?'}
            </p>
            <a
              href="mailto:support@minimal.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
            >
              {language === 'zh' ? '联系我们' : 'Contact Us'}
            </a>
          </div>
        </div>
      </div>

      <Footer theme="light" />
    </div>
  );
}
