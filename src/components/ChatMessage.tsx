import React from 'react';
import { Message } from '../types/chat';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const { avatar } = useGameStore();

  const userAvatarMap: Record<string, string> = {
    male1: 'https://media.giphy.com/media/2gn1hmYEZb8EKlrVZh/giphy.gif',
    female1: 'https://media.giphy.com/media/ZZgpNKl6U2LZuSMqbA/giphy.gif',
    male2: 'https://i.pinimg.com/originals/7d/3a/d6/7d3ad6e74373384f2b7bb7aef959d6bc.gif',
    female2: 'https://i.pinimg.com/originals/af/fd/a8/affda890a0724540380ccf75c8f7d4cf.gif'
  };

  const userAvatarSrc = avatar ? userAvatarMap[avatar] : 'default_user.png';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`max-w-[80%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden`}>
          <img
            src={isUser ? userAvatarSrc : "https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg"}
            alt={isUser ? "User Avatar" : "Assistant Avatar"}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className={`rounded-2xl py-2 px-4 ${isUser
              ? 'bg-purple-500 text-white rounded-tr-none'
              : 'bg-gray-700 text-gray-100 rounded-tl-none'
            }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <span className={`text-xs mt-1 block ${isUser ? 'text-purple-200' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;