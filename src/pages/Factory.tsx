import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

export default function Factory() {
  const { language } = useLanguage();
  const { content } = useContent();
  const { factory } = content;

  return (
    <div className="min-h-screen bg-white">
      <Header theme="light" />

      <div className="pt-20">
        {/* Hero */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={factory.heroImage}
            alt="Factory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold text-white mb-4"
              >
                {factory.heroTitle[language]}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
              >
                {factory.heroSubtitle[language]}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="container mx-auto px-4 py-20">
          <div className="space-y-24">
            {factory.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 items-center`}
              >
                {/* Image */}
                <div className="lg:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={section.image}
                      alt={section.title[language]}
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    {section.title[language]}
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {section.content[language]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gray-900 py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {language === 'zh' ? '想了解更多？' : 'Want to Learn More?'}
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                {language === 'zh'
                  ? '欢迎联系我们，了解更多关于我们的工厂和生产流程'
                  : 'Contact us to learn more about our factory and production process'}
              </p>
              <a
                href="mailto:factory@minimal.com"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                {language === 'zh' ? '联系我们' : 'Contact Us'}
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer theme="light" />
    </div>
  );
}
