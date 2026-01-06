'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Montserrat } from 'next/font/google';
import ShinyText from './ShinyText';
import './LoadingScreen.css';

const montserrat = Montserrat({
  weight: '600',
  subsets: ['latin'],
});

const LoadingScreen = ({ isLoading }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="loading-content">
            <ShinyText
              text="LOADING"
              speed={2}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              delay={0}
              className={`loading-text ${montserrat.className}`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
