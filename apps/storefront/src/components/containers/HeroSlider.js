'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSlider({ slides = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (slides.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsPaused(true);
    // Resume auto-slide after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPaused(true);
    // Resume auto-slide after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  // Don't render if no slides
  if (!slides || slides.length === 0) {
    // Temporary: Show placeholder for testing
    return (
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
        <p className="text-white text-xl">Hero Slider</p>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div 
      className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {currentSlideData.image ? (
            <Link 
              href={currentSlideData.link || '#'} 
              className="block relative w-full h-full"
            >
              <Image
                src={currentSlideData.image}
                alt={currentSlideData.alt || `Hero slide ${currentSlide + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={currentSlide === 0}
              />
            </Link>
          ) : (
            <div className="relative w-full h-full bg-gradient-to-r from-primary to-primary-dark" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 group"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 group"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
