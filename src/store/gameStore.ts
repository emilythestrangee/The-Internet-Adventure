// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export type Avatar = 'male1' | 'female1' | 'male2' | 'female2';

// export type Badge = {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   unlocked: boolean;
//   continent: string;
//   country: string;
//   unlockedAt?: string;
// };

// export type LevelStatus = {
//   id: number;
//   unlocked: boolean;
//   completed: boolean;
//   countries: {
//     [country: string]: {
//       visited: boolean;
//       completed: boolean;
//     }
//   };
// };

// type GameState = {
//   initialized: boolean;
//   playerName: string;
//   avatar: Avatar | null;
//   xp: number;
//   level: number;
//   badges: Badge[];
//   levels: LevelStatus[];
//   currentLevel: number | null;
//   currentCountry: string | null;
// };

// type GameActions = {
//   initializeGame: () => void;
//   setPlayerName: (name: string) => void;
//   setAvatar: (avatar: Avatar) => void;
//   earnXP: (amount: number) => void;
//   unlockLevel: (levelId: number) => void;
//   completeLevel: (levelId: number) => void;
//   unlockBadge: (badgeId: string) => void;
//   setCurrentLevel: (levelId: number | null) => void;
//   setCurrentCountry: (country: string | null) => void;
//   visitCountry: (levelId: number, country: string) => void;
//   completeCountry: (levelId: number, country: string) => void;
//   resetGame: () => void;
// };

// const initialBadges: Badge[] = [
//   {
//     id: 'africa-badge',
//     title: 'Africa UA Ambassador',
//     description: 'Successfully helped Egypt with internationalized domain names!',
//     image: 'africa-badge',
//     unlocked: false,
//     continent: 'Africa',
//     country: 'Egypt'
//   },
//   {
//     id: 'asia-badge',
//     title: 'Asia UA Ambassador',
//     description: 'Mastered email address internationalization in Bahrain and India!',
//     image: 'asia-badge',
//     unlocked: false,
//     continent: 'Asia',
//     country: 'Bahrain'
//   },
//   {
//     id: 'europe-badge',
//     title: 'Europe UA Ambassador',
//     description: 'Helped implement Unicode support in Germany!',
//     image: 'europe-badge',
//     unlocked: false,
//     continent: 'Europe',
//     country: 'Germany'
//   },
//   {
//     id: 'north-america-badge',
//     title: 'North America UA Ambassador',
//     description: 'Solved UA challenges in Mexico!',
//     image: 'north-america-badge',
//     unlocked: false,
//     continent: 'North America',
//     country: 'Mexico'
//   },
//   {
//     id: 'south-america-badge',
//     title: 'South America UA Ambassador',
//     description: 'Fixed email validation in Brazil!',
//     image: 'south-america-badge',
//     unlocked: false,
//     continent: 'South America',
//     country: 'Brazil'
//   },
//   {
//     id: 'australia-badge',
//     title: 'Australia UA Ambassador',
//     description: 'Implemented email server improvements in Australia!',
//     image: 'australia-badge',
//     unlocked: false,
//     continent: 'Australia',
//     country: 'Australia'
//   },
//   {
//     id: 'antarctica-badge',
//     title: 'Antarctica UA Ambassador',
//     description: 'Made research stations UA compliant at the end of the world!',
//     image: 'antarctica-badge',
//     unlocked: false,
//     continent: 'Antarctica',
//     country: 'Research Station'
//   }
// ];

// const initialLevels: LevelStatus[] = [
//   {
//     id: 1,
//     unlocked: true, // First level starts unlocked
//     completed: false,
//     countries: {
//       'Egypt': { visited: false, completed: false },
//     }
//   },
//   {
//     id: 2,
//     unlocked: false,
//     completed: false,
//     countries: {
//       'Bahrain': { visited: false, completed: false },
//       'India': { visited: false, completed: false },
//     }
//   },
//   {
//     id: 3,
//     unlocked: false,
//     completed: false,
//     countries: {
//       'Germany': { visited: false, completed: false },
//     }
//   },
//   {
//     id: 4,
//     unlocked: false,
//     completed: false,
//     countries: {
//       'Mexico': { visited: false, completed: false },
//     }
//   },
//   {
//     id: 5,
//     unlocked: false,
//     completed: false,
//     countries: {
//       'Brazil': { visited: false, completed: false },
//     }
//   },
//   {
//     id: 6,
//     unlocked: false,
//     completed: false,
//     countries: {
//       'Australia': { visited: false, completed: false },
//     }
//   },
//   {
//     id: 7,
//     unlocked: false,
//     completed: false,
//     countries: {
//       'Research Station': { visited: false, completed: false },
//     }
//   }
// ];

// const initialState: GameState = {
//   initialized: false,
//   playerName: '',
//   avatar: null,
//   xp: 0,
//   level: 1,
//   badges: initialBadges,
//   levels: initialLevels,
//   currentLevel: null,
//   currentCountry: null,
// };

// export const useGameStore = create<GameState & GameActions>()(
//   persist(
//     (set, get) => ({
//       ...initialState,

//       initializeGame: () => set({ initialized: true }),

//       setPlayerName: (name: string) => set({ playerName: name }),

//       setAvatar: (avatar: Avatar) => set({ avatar }),

//       earnXP: (amount: number) => {
//         const currentXP = get().xp;
//         const currentLevel = get().level;
//         const newXP = currentXP + amount;
//         const newLevel = Math.floor(newXP / 500) + 1;

//         set({ 
//           xp: newXP,
//           level: newLevel > currentLevel ? newLevel : currentLevel
//         });
//       },

//       unlockLevel: (levelId: number) => {
//         set(state => ({
//           levels: state.levels.map(level => 
//             level.id === levelId ? { ...level, unlocked: true } : level
//           )
//         }));
//       },

//       completeLevel: (levelId: number) => {
//         set(state => ({
//           levels: state.levels.map(level => {
//             if (level.id === levelId) {
//               return { ...level, completed: true };
//             }
//             if (level.id === levelId + 1) {
//               return { ...level, unlocked: true };
//             }
//             return level;
//           })
//         }));
//       },

//       unlockBadge: (badgeId: string) => {
//         set(state => ({
//           badges: state.badges.map(badge => 
//             badge.id === badgeId ? 
//               { ...badge, unlocked: true, unlockedAt: new Date().toISOString() } : 
//               badge
//           )
//         }));
//       },

//       setCurrentLevel: (levelId: number | null) => set({ currentLevel: levelId }),

//       setCurrentCountry: (country: string | null) => set({ currentCountry: country }),

//       visitCountry: (levelId: number, country: string) => {
//         set(state => ({
//           levels: state.levels.map(level => {
//             if (level.id === levelId && level.countries[country]) {
//               return {
//                 ...level,
//                 countries: {
//                   ...level.countries,
//                   [country]: { ...level.countries[country], visited: true }
//                 }
//               };
//             }
//             return level;
//           })
//         }));
//       },

//       completeCountry: (levelId: number, country: string) => {
//         const currentState = get();
//         const levelIndex = currentState.levels.findIndex(l => l.id === levelId);
        
//         if (levelIndex === -1) return;
        
//         const updatedLevels = [...currentState.levels];
//         if (updatedLevels[levelIndex].countries[country]) {
//           updatedLevels[levelIndex].countries[country].completed = true;
//         }
        
//         // Check if all countries in this level are completed
//         const allCountriesCompleted = Object.values(updatedLevels[levelIndex].countries)
//           .every(country => country.completed);
        
//         if (allCountriesCompleted) {
//           updatedLevels[levelIndex].completed = true;
          
//           // Unlock next level if available
//           if (levelIndex + 1 < updatedLevels.length) {
//             updatedLevels[levelIndex + 1].unlocked = true;
//           }
          
//           // Unlock the badge for this level
//           const badgeToUnlock = currentState.badges.find(
//             badge => badge.continent === getLevelContinent(levelId)
//           );
          
//           if (badgeToUnlock) {
//             set(state => ({
//               levels: updatedLevels,
//               badges: state.badges.map(badge => 
//                 badge.id === badgeToUnlock.id ? 
//                   { ...badge, unlocked: true, unlockedAt: new Date().toISOString() } : 
//                   badge
//               )
//             }));
//             return;
//           }
//         }
        
//         set({ levels: updatedLevels });
//       },

//       resetGame: () => set(initialState),
//     }),
//     {
//       name: 'ua-adventure-game-storage',
//     }
//   )
// );

// // Helper function to get continent name from level ID
// function getLevelContinent(levelId: number): string {
//   switch (levelId) {
//     case 1: return 'Africa';
//     case 2: return 'Asia';
//     case 3: return 'Europe';
//     case 4: return 'North America';
//     case 5: return 'South America';
//     case 6: return 'Australia';
//     case 7: return 'Antarctica';
//     default: return '';
//   }
// }

// // Helper hooks for level access
// export const canAccessLevel = (levelId: number): boolean => {
//   const { levels } = useGameStore.getState();
//   const level = levels.find(l => l.id === levelId);
//   return level?.unlocked || false;
// };

// export const getPlayerLevel = (): string => {
//   const { level } = useGameStore.getState();
  
//   switch (level) {
//     case 1: return 'Trainee';
//     case 2: return 'Explorer';
//     case 3: return 'Champion';
//     case 4: return 'Ambassador';
//     default: return 'Trainee';
//   }
// };

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Avatar = 'male1' | 'female1' | 'male2' | 'female2';

export type Badge = {
  id: string;
  title: string;
  description: string;
  image: string;
  unlocked: boolean;
  continent: string;
  country: string;
  unlockedAt?: string;
};

export type LevelStatus = {
  id: number;
  unlocked: boolean;
  completed: boolean;
  countries: {
    [country: string]: {
      visited: boolean;
      completed: boolean;
    }
  };
};

type GameState = {
  initialized: boolean;
  playerName: string;
  avatar: Avatar | null;
  xp: number;
  level: number;
  badges: Badge[];
  levels: LevelStatus[];
  currentLevel: number | null;
  currentCountry: string | null;
  language: 'en' | 'ar'; // Add more codes as needed
};

type GameActions = {
  initializeGame: () => void;
  setPlayerName: (name: string) => void;
  setAvatar: (avatar: Avatar) => void;
  earnXP: (amount: number) => void;
  unlockLevel: (levelId: number) => void;
  completeLevel: (levelId: number) => void;
  unlockBadge: (badgeId: string) => void;
  setCurrentLevel: (levelId: number | null) => void;
  setCurrentCountry: (country: string | null) => void;
  visitCountry: (levelId: number, country: string) => void;
  completeCountry: (levelId: number, country: string) => void;
  resetGame: () => void;
  setLanguage: (lang: 'en' | 'ar') => void; // New action
};

const initialBadges: Badge[] = [
  {
    id: 'africa-badge',
    title: 'Africa UA Ambassador',
    description: 'Successfully helped Egypt with internationalized domain names!',
    image: 'africa-badge',
    unlocked: false,
    continent: 'Africa',
    country: 'Egypt'
  },
  {
    id: 'asia-badge',
    title: 'Asia UA Ambassador',
    description: 'Mastered email address internationalization in Bahrain and India!',
    image: 'asia-badge',
    unlocked: false,
    continent: 'Asia',
    country: 'Bahrain'
  },
  {
    id: 'europe-badge',
    title: 'Europe UA Ambassador',
    description: 'Helped implement Unicode support in Germany!',
    image: 'europe-badge',
    unlocked: false,
    continent: 'Europe',
    country: 'Germany'
  },
  {
    id: 'north-america-badge',
    title: 'North America UA Ambassador',
    description: 'Solved UA challenges in Mexico!',
    image: 'north-america-badge',
    unlocked: false,
    continent: 'North America',
    country: 'Mexico'
  },
  {
    id: 'south-america-badge',
    title: 'South America UA Ambassador',
    description: 'Fixed email validation in Brazil!',
    image: 'south-america-badge',
    unlocked: false,
    continent: 'South America',
    country: 'Brazil'
  },
  {
    id: 'australia-badge',
    title: 'Australia UA Ambassador',
    description: 'Implemented email server improvements in Australia!',
    image: 'australia-badge',
    unlocked: false,
    continent: 'Australia',
    country: 'Australia'
  },
  {
    id: 'antarctica-badge',
    title: 'Antarctica UA Ambassador',
    description: 'Made research stations UA compliant at the end of the world!',
    image: 'antarctica-badge',
    unlocked: false,
    continent: 'Antarctica',
    country: 'Research Station'
  }
];

const initialLevels: LevelStatus[] = [
  {
    id: 1,
    unlocked: true,
    completed: false,
    countries: {
      'Egypt': { visited: false, completed: false },
    }
  },
  {
    id: 2,
    unlocked: false,
    completed: false,
    countries: {
      'Bahrain': { visited: false, completed: false },
      'India': { visited: false, completed: false },
    }
  },
  {
    id: 3,
    unlocked: false,
    completed: false,
    countries: {
      'Germany': { visited: false, completed: false },
    }
  },
  {
    id: 4,
    unlocked: false,
    completed: false,
    countries: {
      'Mexico': { visited: false, completed: false },
    }
  },
  {
    id: 5,
    unlocked: false,
    completed: false,
    countries: {
      'Brazil': { visited: false, completed: false },
    }
  },
  {
    id: 6,
    unlocked: false,
    completed: false,
    countries: {
      'Australia': { visited: false, completed: false },
    }
  },
  {
    id: 7,
    unlocked: false,
    completed: false,
    countries: {
      'Research Station': { visited: false, completed: false },
    }
  }
];

const initialState: GameState = {
  initialized: false,
  playerName: '',
  avatar: null,
  xp: 0,
  level: 1,
  badges: initialBadges,
  levels: initialLevels,
  currentLevel: null,
  currentCountry: null,
  language: 'en', // Default language
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeGame: () => set({ initialized: true }),

      setPlayerName: (name: string) => set({ playerName: name }),

      setAvatar: (avatar: Avatar) => set({ avatar }),

      earnXP: (amount: number) => {
        const currentXP = get().xp;
        const currentLevel = get().level;
        const newXP = currentXP + amount;
        const newLevel = Math.floor(newXP / 500) + 1;

        set({ 
          xp: newXP,
          level: newLevel > currentLevel ? newLevel : currentLevel
        });
      },

      unlockLevel: (levelId: number) => {
        set(state => ({
          levels: state.levels.map(level => 
            level.id === levelId ? { ...level, unlocked: true } : level
          )
        }));
      },

      completeLevel: (levelId: number) => {
        set(state => ({
          levels: state.levels.map(level => {
            if (level.id === levelId) {
              return { ...level, completed: true };
            }
            if (level.id === levelId + 1) {
              return { ...level, unlocked: true };
            }
            return level;
          })
        }));
      },

      unlockBadge: (badgeId: string) => {
        set(state => ({
          badges: state.badges.map(badge => 
            badge.id === badgeId ? 
              { ...badge, unlocked: true, unlockedAt: new Date().toISOString() } : 
              badge
          )
        }));
      },

      setCurrentLevel: (levelId: number | null) => set({ currentLevel: levelId }),

      setCurrentCountry: (country: string | null) => set({ currentCountry: country }),

      visitCountry: (levelId: number, country: string) => {
        set(state => ({
          levels: state.levels.map(level => {
            if (level.id === levelId && level.countries[country]) {
              return {
                ...level,
                countries: {
                  ...level.countries,
                  [country]: { ...level.countries[country], visited: true }
                }
              };
            }
            return level;
          })
        }));
      },

      completeCountry: (levelId: number, country: string) => {
        const currentState = get();
        const levelIndex = currentState.levels.findIndex(l => l.id === levelId);
        
        if (levelIndex === -1) return;
        
        const updatedLevels = [...currentState.levels];
        if (updatedLevels[levelIndex].countries[country]) {
          updatedLevels[levelIndex].countries[country].completed = true;
        }
        
        const allCountriesCompleted = Object.values(updatedLevels[levelIndex].countries)
          .every(country => country.completed);
        
        if (allCountriesCompleted) {
          updatedLevels[levelIndex].completed = true;
          
          if (levelIndex + 1 < updatedLevels.length) {
            updatedLevels[levelIndex + 1].unlocked = true;
          }
          
          const badgeToUnlock = currentState.badges.find(
            badge => badge.continent === getLevelContinent(levelId)
          );
          
          if (badgeToUnlock) {
            set(state => ({
              levels: updatedLevels,
              badges: state.badges.map(badge => 
                badge.id === badgeToUnlock.id ? 
                  { ...badge, unlocked: true, unlockedAt: new Date().toISOString() } : 
                  badge
              )
            }));
            return;
          }
        }
        
        set({ levels: updatedLevels });
      },

      resetGame: () => set(initialState),

      // 🔤 Set Language
      setLanguage: (lang: 'en' | 'ar') => set({ language: lang }),
    }),
    {
      name: 'ua-adventure-game-storage',
    }
  )
);

// Helper function
function getLevelContinent(levelId: number): string {
  switch (levelId) {
    case 1: return 'Africa';
    case 2: return 'Asia';
    case 3: return 'Europe';
    case 4: return 'North America';
    case 5: return 'South America';
    case 6: return 'Australia';
    case 7: return 'Antarctica';
    default: return '';
  }
}

export const canAccessLevel = (levelId: number): boolean => {
  const { levels } = useGameStore.getState();
  const level = levels.find(l => l.id === levelId);
  return level?.unlocked || false;
};

export const getPlayerLevel = (): string => {
  const { level } = useGameStore.getState();
  
  switch (level) {
    case 1: return 'Trainee';
    case 2: return 'Explorer';
    case 3: return 'Champion';
    case 4: return 'Ambassador';
    default: return 'Trainee';
  }
};
