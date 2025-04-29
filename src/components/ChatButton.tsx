import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, onClick }) => {
  return (
    <motion.button
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg z-50 hover:bg-purple-600 transition-colors ${
        isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open chat"
    >
      <MessageCircle size={24} />
    </motion.button>
  );
};

export default ChatButton;