import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

interface CarouselProps {
  theme?: 'light' | 'dark' | 'vintage' | 'street' | 'luxury';
  autoPlay?: boolean;
  interval?: number;
}

export default function Carousel({ 
  theme = 'light',
  autoPlay = true, 
  interval = 5000 
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { language } = useLanguage();
  const { content } = useContent();

  const slides = content.home.carousel.slides;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide]);

  const themeStyles = {
    light: {
      title: 'text-white',
      subtitle: 'text-white/80',
      button: 'bg-white text-gray-900 hover:bg-gray-100',
      indicator: 'bg-white/50 hover:bg-white',
      activeIndicator: 'bg-white',
      arrow: 'bg-white/20 hover:bg-white/30 text-white',
    },
    dark: {
      title: 'text-white',
      subtitle: 'text-white/80',
      button: 'bg-white text-gray-900 hover:bg-gray-100',
      indicator: 'bg-white/50 hover:bg-white',
      activeIndicator: 'bg-white',
      arrow: 'bg-white/20 hover:bg-white/30 text-white',
    },
    vintage: {
      title: 'text-amber-50',
      subtitle: 'text-amber-100/80',
      button: 'bg-amber-800 text-amber-50 hover:bg-amber-700',
      indicator: 'bg-amber-100/50 hover:bg-amber-100',
      activeIndicator: 'bg-amber-100',
      arrow: 'bg-amber-900/40 hover:bg-amber-900/60 text-amber-50',
    },
    street: {
      title: 'text-white',
      subtitle: 'text-white/80',
      button: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      indicator: 'bg-white/50 hover:bg-white',
      activeIndicator: 'bg-white',
      arrow: 'bg-black/40 hover:bg-black/60 text-white',
    },
    luxury: {
      title: 'text-amber-100',
      subtitle: 'text-amber-200/80',
      button: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black',
      indicator: 'bg-amber-500/50 hover:bg-amber-500',
      activeIndicator: 'bg-amber-500',
      arrow: 'bg-black/50 hover:bg-black/70 text-amber-100',
    },
  };

  const style = themeStyles[theme];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentSlide.image}
              alt={currentSlide.title[language]}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-4 ${style.title}`}
              >
                {currentSlide.title[language]}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className={`text-lg md:text-xl mb-8 ${style.subtitle}`}
              >
                {currentSlide.subtitle[language]}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className={`px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 ${style.button}`}
              >
                {currentSlide.cta[language]}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all ${style.arrow}`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all ${style.arrow}`}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? style.activeIndicator : style.indicator
            }`}
          />
        ))}
      </div>
    </div>
  );
}
