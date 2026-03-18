import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

interface StatisticsProps {
  theme?: 'light' | 'dark';
}

function AnimatedNumber({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/\D/g, ''));
      const suffix = value.replace(/[0-9]/g, '');
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current) + suffix);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function Statistics({ theme = 'light' }: StatisticsProps) {
  const { language } = useLanguage();
  const { content } = useContent();
  const { statistics } = content.home;

  const themeStyles = {
    light: {
      bg: 'bg-gray-900',
      title: 'text-white',
      value: 'text-white',
      label: 'text-gray-400',
    },
    dark: {
      bg: 'bg-black',
      title: 'text-white',
      value: 'text-white',
      label: 'text-gray-400',
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
          <h2 className={`text-3xl md:text-4xl font-bold ${style.title}`}>
            {statistics.title[language]}
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-2 ${style.value}`}>
                <AnimatedNumber value={stat.value} />
              </div>
              <div className={`text-sm md:text-base ${style.label}`}>
                {stat.label[language]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
