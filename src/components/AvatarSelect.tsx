import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Avatar } from '../store/gameStore';

interface AvatarSelectProps {
  selectedAvatar: Avatar | null;
  onSelect: (avatar: Avatar) => void;
}

const AvatarSelect: React.FC<AvatarSelectProps> = ({ selectedAvatar, onSelect }) => {
  const avatars: Array<{ id: Avatar, label: string, imgSrc: string }> = [
    { 
      id: 'male1', 
      label: 'Explorer (Male)', 
      imgSrc: 'https://media.giphy.com/media/2gn1hmYEZb8EKlrVZh/giphy.gif?cid=ecf05e47ebd1jgfs9twp0ix1lxpupj2b40bk3084qt0p75yx&ep=v1_gifs_search&rid=giphy.gif&ct=g' // <-- placeholder path
    },
    { 
      id: 'female1', 
      label: 'Explorer (Female)', 
      imgSrc: 'https://media.giphy.com/media/ZZgpNKl6U2LZuSMqbA/giphy.gif?cid=ecf05e471i7e93nybumik6fryiazvotak62qssqv1v6xgux8&ep=v1_gifs_search&rid=giphy.gif&ct=g' // <-- placeholder path
    },
    { 
      id: 'male2', 
      label: 'Ambassador (Male)', 
      imgSrc: 'https://i.pinimg.com/originals/7d/3a/d6/7d3ad6e74373384f2b7bb7aef959d6bc.gif' // <-- placeholder path
    },
    { 
      id: 'female2', 
      label: 'Ambassador (Female)', 
      imgSrc: 'https://i.pinimg.com/originals/af/fd/a8/affda890a0724540380ccf75c8f7d4cf.gif' // <-- placeholder path
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text--900 mb-4 text-center">
        Choose Your Avatar
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {avatars.map((avatar) => (
          <motion.div
            key={avatar.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-4 rounded-lg flex flex-col items-center cursor-pointer ${
              selectedAvatar === avatar.id
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-white border border-gray-200 hover:border-primary-300'
            }`}
            onClick={() => onSelect(avatar.id)}
          >
            <div className={`h-24 w-24 rounded-full overflow-hidden flex items-center justify-center ${
              selectedAvatar === avatar.id ? 'bg-primary-100' : 'bg-gray-100'
            }`}>
              {/* Avatar Image */}
              <img 
                src={avatar.imgSrc} 
                alt={avatar.label} 
                className="object-cover h-full w-full"
              />
            </div>
            
            <div className="mt-3 text-center">
              <p className={`font-medium ${
                selectedAvatar === avatar.id ? 'text-primary-700' : 'text-gray-700'
              }`}>
                {avatar.label}
              </p>
            </div>
            
            {selectedAvatar === avatar.id && (
              <div className="absolute top-2 right-2 bg-primary-500 rounded-full p-1">
                <Check className="h-4 w-4 text-black" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelect;


