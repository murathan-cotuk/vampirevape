'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: '/images/hero-1.jpg',
    title: 'Premium E-Liquids',
    subtitle: 'Entdecken Sie unsere Top-Qualität',
    cta: 'Jetzt shoppen',
    link: '/e-liquids',
  },
  {
    id: 2,
    image: '/images/hero-2.jpg',
    title: 'Neue Hardware',
    subtitle: 'Die neuesten E-Zigaretten',
    cta: 'Mehr erfahren',
    link: '/hardware',
  },
  {
    id: 3,
    image: '/images/hero-3.jpg',
    title: 'Special Angebote',
    subtitle: 'Bis zu 30% Rabatt',
    cta: 'Angebote ansehen',
    link: '/angebote',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full bg-gradient-to-r from-primary to-primary-dark">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <div className="container-custom relative z-20 h-full flex items-center">
              <div className="text-white max-w-2xl">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl mb-8"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
                <motion.a
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  href={slides[currentSlide].link}
                  className="btn-primary inline-block"
                >
                  {slides[currentSlide].cta}
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

