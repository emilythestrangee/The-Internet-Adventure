// import React, { useState } from 'react';
// import axios from 'axios';

// const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

// const LanguageToggle: React.FC = () => {
//   const [language, setLanguage] = useState<'en' | 'ar'>('en');
//   const [translating, setTranslating] = useState(false);

//   const translatePage = async (targetLang: 'en' | 'ar') => {
//     try {
//       setTranslating(true);
//       const elements = document.querySelectorAll('body *:not(script):not(style):not(meta)');

//       for (const element of Array.from(elements)) {
//         if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
//           const text = element.textContent?.trim();
//           if (text) {
//             const response = await axios.post(
//               `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
//               {
//                 q: text,
//                 source: language,
//                 target: targetLang,
//                 format: 'text',
//               },
//               {
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//               }
//             );

//             const translatedText = response.data.data.translations[0].translatedText;
//             element.textContent = translatedText;
//           }
//         }
//       }

//       setLanguage(targetLang);
//     } catch (error) {
//       console.error('Translation error:', error);
//     } finally {
//       setTranslating(false);
//     }
//   };

//   const handleSwitchLanguage = () => {
//     const targetLang = language === 'en' ? 'ar' : 'en';
//     translatePage(targetLang);
//   };

//   return (
//     <div className="fixed top-4 right-4 z-50">
//       <button
//         onClick={handleSwitchLanguage}
//         disabled={translating}
//         className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-800 transition disabled:opacity-50"
//       >
//         {translating ? 'Translating...' : language === 'en' ? 'عربي' : 'English'}
//       </button>
//     </div>
//   );
// };

// export default LanguageToggle;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGameStore } from '../store/gameStore'; // adjust path as needed

const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

const LanguageToggle: React.FC = () => {
  const language = useGameStore(state => state.language);
  const setLanguage = useGameStore(state => state.setLanguage);
  const [translating, setTranslating] = useState(false);

  const translatePage = async (targetLang: 'en' | 'ar') => {
    try {
      setTranslating(true);

      const elements = document.querySelectorAll('body *:not(script):not(style):not(meta)');

      for (const element of Array.from(elements)) {
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
          const text = element.textContent?.trim();
          if (text) {
            const response = await axios.post(
              `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
              {
                q: text,
                source: language,
                target: targetLang,
                format: 'text',
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            const translatedText = response.data.data.translations[0].translatedText;
            element.textContent = translatedText;
          }
        }
      }

      setLanguage(targetLang);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(false);
    }
  };

  const handleSwitchLanguage = () => {
    const targetLang = language === 'en' ? 'ar' : 'en';
    translatePage(targetLang);
  };

  useEffect(() => {
    // Apply stored language on mount
    if (language !== 'en') {
      translatePage(language);
    }
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleSwitchLanguage}
        disabled={translating}
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-800 transition disabled:opacity-50"
      >
        {translating ? 'Translating...' : language === 'en' ? 'عربي' : 'English'}
      </button>
    </div>
  );
};

export default LanguageToggle;
