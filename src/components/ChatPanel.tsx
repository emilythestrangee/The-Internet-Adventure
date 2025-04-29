import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message } from '../types/chat';
import { sendMessageToOpenAI } from '../services/openaiService';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessageToOpenAI(content, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response from OpenAI:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const panelVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '100%', opacity: 0 }
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-full bg-gray-800 shadow-lg z-40 flex flex-col"
      style={{ width: window.innerWidth <= 768 ? '80%' : '30%' }}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={panelVariants}
      transition={{ type: 'tween', duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100">Chat Assistant</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded-full transition-colors text-purple-400 hover:text-purple-300"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-center py-2">
            <div className="loader">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </motion.div>
  );
};

export default ChatPanel;