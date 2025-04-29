import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Globe,
  Home,
  Info,
  Award,
  User,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useGameStore, getPlayerLevel } from '../store/gameStore';
import ProgressBar from './ProgressBar';

interface LayoutProps {
  children: React.ReactNode;
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    initialized,
    playerName,
    xp,
    level,
    badges,

    resetGame
  } = useGameStore();

  
const avatarMap: Record<string, string> = {
  male1: 'https://media.giphy.com/media/2gn1hmYEZb8EKlrVZh/giphy.gif',
  female1: 'https://media.giphy.com/media/ZZgpNKl6U2LZuSMqbA/giphy.gif',
  male2: 'https://i.pinimg.com/originals/7d/3a/d6/7d3ad6e74373384f2b7bb7aef959d6bc.gif',
  female2: 'https://i.pinimg.com/originals/af/fd/a8/affda890a0724540380ccf75c8f7d4cf.gif',
};

const { avatar } = useGameStore();
const avatarUrl = avatar ? avatarMap[avatar] : null;

  // Calculate progress to next level (500 XP per level)
  const levelProgress = (xp % 500) / 500 * 100;
  const unlockedBadges = badges.filter(badge => badge.unlocked).length;
  const playerRank = getPlayerLevel();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to reset your game progress?')) {
      resetGame();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                <Link to="/">The Internet Adventure</Link>
              </h1>
            </div>

            <nav className="flex space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location.pathname === '/'
                    ? 'text-primary-600 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>

              <Link
                to="/about"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location.pathname === '/about'
                    ? 'text-primary-600 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Info className="w-4 h-4 mr-1" />
                About
              </Link>

              <Link
                to="/badges"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${location.pathname === '/badges'
                    ? 'text-primary-600 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Award className="w-4 h-4 mr-1" />
                Badges
              </Link>
            </nav>

            {initialized && (
              <div className="flex items-center">
                <div className="mr-4 text-right">
                  <p className="text-sm font-medium text-gray-900">{playerName}</p>
                  <p className="text-xs text-gray-500">
                    <span className="badge badge-primary mr-1">{playerRank}</span>
                    <span>Level {level}</span>
                  </p>
                </div>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Player Avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                  aria-label="Reset game"
                  title="Reset game progress"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Player progress bar - only show if game is initialized */}
      {initialized && !location.pathname.includes('/about') && (
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center text-sm">
              <div className="flex-1">
                <ProgressBar
                  progress={levelProgress}
                  label={`XP: ${xp} / ${level * 500}`}
                />
              </div>
              <div className="ml-4 flex items-center">
                <Award className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-gray-700">{unlockedBadges} / {badges.length} Badges</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level navigation breadcrumbs - only show on level pages */}
      {location.pathname.includes('/level/') && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-700">Home</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="font-medium text-gray-900">
                {location.pathname.includes('level/1') && 'Level 1: Africa'}
                {location.pathname.includes('level/2') && 'Level 2: Asia'}
                {location.pathname.includes('level/3') && 'Level 3: Europe'}
                {location.pathname.includes('level/4') && 'Level 4: North America'}
                {location.pathname.includes('level/5') && 'Level 5: South America'}
                {location.pathname.includes('level/6') && 'Level 6: Australia'}
                {location.pathname.includes('level/7') && 'Level 7: Antarctica'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Globe className="h-6 w-6 text-gray-400 mr-2" />
              <p className="text-gray-500 text-sm">
                The Internet Adventure: Become a UA Ambassador
              </p>
            </div>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              An educational game about Universal Acceptance
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;