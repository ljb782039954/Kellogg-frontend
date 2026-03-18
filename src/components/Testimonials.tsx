import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

interface TestimonialsProps {
  theme?: 'light' | 'dark';
}

export default function Testimonials({ theme = 'light' }: TestimonialsProps) {
  const { language } = useLanguage();
  const { content } = useContent();
  const { testimonials } = content.home;

  const themeStyles = {
    light: {
      bg: 'bg-gray-50',
      title: 'text-gray-800',
      subtitle: 'text-gray-500',
      card: 'bg-white',
      name: 'text-gray-800',
      role: 'text-gray-500',
      content: 'text-gray-600',
    },
    dark: {
      bg: 'bg-gray-800',
      title: 'text-white',
      subtitle: 'text-gray-400',
      card: 'bg-gray-700',
      name: 'text-white',
      role: 'text-gray-400',
      content: 'text-gray-300',
    },
  };

  const style = themeStyles[theme];

  return (
    <section className={`py-20 ${style.bg}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${style.title}`}>
            {testimonials.title[language]}
          </h2>
          <p className={`text-lg ${style.subtitle}`}>
            {testimonials.subtitle[language]}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`${style.card} rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow`}
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-gray-300 mb-6" />

              {/* Content */}
              <p className={`text-base leading-relaxed mb-8 ${style.content}`}>
                "{item.content[language]}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={item.avatar}
                    alt={item.name[language]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className={`font-semibold ${style.name}`}>
                    {item.name[language]}
                  </h4>
                  <p className={`text-sm ${style.role}`}>
                    {item.role[language]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
