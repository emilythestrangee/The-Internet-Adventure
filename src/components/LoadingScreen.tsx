import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Typed from 'typed.js';
import { Globe } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const typedElementRef = useRef<HTMLDivElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);

  useEffect(() => {
    if (typedElementRef.current) {
      typedInstanceRef.current = new Typed(typedElementRef.current, {
        strings: [
          'Connecting to the global internet...',
          'In a world where the internet connects us all...',
          'Not everyone can use their own language online...',
          'Universal Acceptance aims to change that...',
          'Your mission is about to begin...'
        ],
        typeSpeed: 40,
        backSpeed: 20,
        backDelay: 1000,
        loop: false,
        showCursor: true,
      });
    }

    return () => {
      typedInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 text-white z-50 overflow-hidden">
      
      {/* GIF Background with Zoom Out */}
      <div className="absolute inset-0 z-0 scale-90">
        <img
          src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExanc2dzB1aDZudjBlY2RmYW12NGVxeXZwOG93dnM3OTVsYXM5dWdtdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/phwcO1vmJhqTrwKp2h/giphy.gif" // <-- Replace with your GIF path
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <Globe size={100} className="text-white animate-spin-slow" />
          <motion.div
            className="absolute -inset-4 border-2 border-t-accent-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <div className="text-center max-w-md mx-auto mb-8">
          <div ref={typedElementRef} className="text-xl md:text-2xl font-medium text-white min-h-[60px]"></div>
        </div>

        <motion.div
          className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-accent-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          className="mt-8 opacity-0"
          animate={{ opacity: [0, 0, 1] }}
          transition={{ times: [0, 0.8, 1], duration: 3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            The Internet Adventure: Become a UA Ambassador
          </h1>
        </motion.div>
      </div>

    </div>
  );
};

export default LoadingScreen;
