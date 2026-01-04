'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const letters = ['M', 'O', 'O', 'N'];

  return (
    <main
      ref={scrollRef}
      className="relative flex h-screen w-full text-white overflow-hidden"
    >
      {/* Left Image Column */}
      <motion.div
        style={{ y: bgY }}
        className="w-1/4 md:w-1/3 relative h-screen"
      >
        <Image
          src="/cover.jpeg"
          alt="Left"
          fill
          sizes="(min-width: 768px) 33vw, 25vw"
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Center Content */}
      <div className="w-1/2 md:w-1/3 h-screen bg-green-50/90 z-10 flex flex-col justify-center items-center text-center px-2 sm:px-3 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          className="mb-2 sm:mb-3 md:mb-4 w-full flex justify-center flex-shrink-0"
        >
          <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px]">
            <Image
              src="/lostmoon.PNG"
              alt="Lost Moon"
              fill
              sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Animated Title */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-green-800 drop-shadow-[0_0_30px_rgba(0,255,0,0.7)] mb-2 sm:mb-3 md:mb-4 flex-shrink-0"
        >
          {letters.map((char, i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -5, 0, 5, 0],
                textShadow: [
                  '0 0 5px #00ff00',
                  '0 0 15px #00ff00',
                  '0 0 25px #00ff00',
                  '0 0 15px #00ff00',
                  '0 0 5px #00ff00',
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
              className="mx-0.5 sm:mx-1 md:mx-2"
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xs sm:text-sm md:text-base lg:text-lg text-green-400 mb-2 sm:mb-3 md:mb-4 px-2 flex-shrink-0"
        >
          Diamond drops. Unique Art. Star Studded.
        </motion.p>

        {/* CTA */}
        <motion.a
          href="/shop"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 35px rgba(0,255,0,0.9)',
          }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-green-500 hover:bg-green-600 font-black rounded-xl shadow-lg text-white no-underline inline-block w-auto flex-shrink-0"
        >
          Enter Store
        </motion.a>
      </div>

      {/* Right Image Column */}
      <motion.div
        style={{ y: bgY }}
        className="w-1/4 md:w-1/3 relative h-screen"
      >
        <Image
          src="/cover.jpeg"
          alt="Right"
          fill
          sizes="(min-width: 768px) 33vw, 25vw"
          className="object-cover"
          priority
        />
      </motion.div>
    </main>
  );
}
