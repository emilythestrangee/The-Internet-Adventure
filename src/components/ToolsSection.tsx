import React from 'react';
import { FileText, MessageSquare, Search } from 'lucide-react';
import ToolCard from './ToolCard';

const tools = [
  {
    id: 'translator',
    title: 'Document Translator',
    description: 'Upload documents in any language and get accurate translations powered by AI. Perfect for making content accessible to everyone.',
    icon: FileText,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'summarizer',
    title: 'Smart Summarizer & Chatbot',
    description: 'Get instant summaries of your documents and chat with an AI that understands your content. Ask questions in any language!',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-400',
  },
  {
    id: 'explorer',
    title: 'Interactive Document Explorer',
    description: 'Explore documents interactively! Select any term to get AI-powered explanations and discover related content within your document.',
    icon: Search,
    color: 'from-amber-500 to-orange-400',
  },
];

const ToolsSection: React.FC = () => {
  return (
    <section className="bg-gray-900 text-white mt-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-100 mb-4">
          Empower Your Learning with Smart Tools 🛠
        </h2>
        <p className="text-xl text-gray-300">
          Explore our AI-powered tools for Universal Acceptance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>
    </section>
  );
};

export default ToolsSection;