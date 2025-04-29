import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-3 border border-gray-600 rounded-full bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400"
        disabled={isLoading}
      />
      <motion.button
        type="submit"
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          message.trim() && !isLoading ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-600 text-gray-400'
        }`}
        disabled={!message.trim() || isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Send size={18} />
      </motion.button>
    </form>
  );
};

export default ChatInput;