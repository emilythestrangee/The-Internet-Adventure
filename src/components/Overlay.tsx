import React from 'react';
import { motion } from 'framer-motion';

interface OverlayProps {
  isVisible: boolean;
  onClick: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ isVisible, onClick }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 0.3 : 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    />
  );
};

export default Overlay;