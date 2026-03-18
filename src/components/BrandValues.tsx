import { motion } from 'framer-motion';
import { Leaf, Award, Heart, Recycle, Sparkles, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

const iconMap: Record<string, React.ElementType> = {
  Leaf,
  Award,
  Heart,
  Recycle,
  Sparkles,
  Shield,
};

interface BrandValuesProps {
  theme?: 'light' | 'dark';
}

export default function BrandValues({ theme = 'light' }: BrandValuesProps) {
  const { language } = useLanguage();
  const { content } = useContent();
  const { brandValues } = content.home;

  const themeStyles = {
    light: {
      bg: 'bg-white',
      title: 'text-gray-800',
      subtitle: 'text-gray-500',
      card: 'bg-gray-50',
      cardTitle: 'text-gray-800',
      cardDesc: 'text-gray-600',
    },
    dark: {
      bg: 'bg-gray-900',
      title: 'text-white',
      subtitle: 'text-gray-400',
      card: 'bg-gray-800',
      cardTitle: 'text-white',
      cardDesc: 'text-gray-300',
    },
  };

  const style = themeStyles[theme];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

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
            {brandValues.title[language]}
          </h2>
          <p className={`text-lg ${style.subtitle}`}>
            {brandValues.subtitle[language]}
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {brandValues.values.map((value, index) => {
            const IconComponent = iconMap[value.icon] || Sparkles;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`${style.card} rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${style.cardTitle}`}>
                  {value.title[language]}
                </h3>
                <p className={`text-sm leading-relaxed ${style.cardDesc}`}>
                  {value.description[language]}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
