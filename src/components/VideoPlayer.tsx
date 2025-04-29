import React from 'react';

interface VideoPlayerProps {
  videoPlaceholder: boolean;
  title: string;
  description: string;
  countryName: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoPlaceholder,
  title,
  description,
  countryName
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      
      <div className="bg-gray-800 flex items-center justify-center relative" style={{ minHeight: '360px' }}>
        <img 
          src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExajh1c2Z5dTJxYXQ4cWQ3azl4MHVpNzhxZmVnc242YXViaHRscWtvdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/du8zLDMdRolor6AtOw/giphy.gif"
          alt="Video placeholder"
          className="absolute inset-0 w-full h-full object-contain"
        />
        
        <div className="relative w-full h-full min-h-[240px] flex flex-col items-center justify-center p-4 text-center">
          <div className="mb-4 text-white">
            <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 8L16 12L10 16V8Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {title}
          </h3>
          
          <p className="text-gray-300 mb-4 max-w-lg">
            {description}
          </p>
          
          <div className="px-4 py-2 bg-black/30 rounded-lg text-sm text-white">
          </div>
        </div>
      </div>

      {/* Caption area */}
      <div className="p-4 bg-black">
        <div className="p-3 bg-gray-800 rounded text-white text-sm">
          <p className="italic">
            "Welcome to {countryName}! Today we're facing a challenge with Universal Acceptance. 
            People here are struggling with {Math.random() > 0.5 ? 'email addresses' : 'domain names'} in their local language. 
            Let's help them solve this problem!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
