import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ id, title, description, icon: Icon, color }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-gray-800 rounded-xl overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`h-2 bg-gradient-to-r ${color}`} />
      <div className="p-6">
        <div className="mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-100 mb-3">{title}</h3>
        <p className="text-gray-300 mb-6">{description}</p>
        <motion.button
          onClick={() => navigate(`/${id}`)}
          className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r ${color} text-white font-semibold
            hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Launch Tool
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ToolCard;