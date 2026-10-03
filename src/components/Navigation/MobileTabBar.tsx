import React from 'react';
import { Home, Search, PlusSquare, Film, User as UserIcon } from 'lucide-react';
import { User } from '../../types/instagram';

interface MobileTabBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCreateModal: () => void;
  currentUser: User;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentTab,
  setCurrentTab,
  openCreateModal,
  currentUser,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 h-14 flex items-center justify-around px-2">
      <button
        onClick={() => setCurrentTab('home')}
        className={`p-2 flex flex-col items-center justify-center min-w-[48px] min-h-[48px] transition-colors ${
          currentTab === 'home' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
        }`}
        aria-label="Home Feed"
      >
        <Home className={`w-6 h-6 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
      </button>

      <button
        onClick={() => setCurrentTab('explore')}
        className={`p-2 flex flex-col items-center justify-center min-w-[48px] min-h-[48px] transition-colors ${
          currentTab === 'explore' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
        }`}
        aria-label="Explore & Search"
      >
        <Search className={`w-6 h-6 ${currentTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
      </button>

      <button
        onClick={openCreateModal}
        className="p-2 flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-neutral-800 dark:text-neutral-200 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Create Post"
      >
        <PlusSquare className="w-6 h-6 stroke-[1.8]" />
      </button>

      <button
        onClick={() => setCurrentTab('reels')}
        className={`p-2 flex flex-col items-center justify-center min-w-[48px] min-h-[48px] transition-colors ${
          currentTab === 'reels' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
        }`}
        aria-label="Reels"
      >
        <Film className={`w-6 h-6 ${currentTab === 'reels' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
      </button>

      <button
        onClick={() => setCurrentTab('profile')}
        className="p-2 flex flex-col items-center justify-center min-w-[48px] min-h-[48px]"
        aria-label="Profile"
      >
        <div className={`w-6 h-6 rounded-full overflow-hidden border ${
          currentTab === 'profile' 
            ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900 dark:ring-white ring-offset-1 dark:ring-offset-black' 
            : 'border-neutral-300 dark:border-neutral-700'
        }`}>
          {currentUser.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <UserIcon className="w-full h-full p-0.5 text-neutral-400" />
          )}
        </div>
      </button>
    </nav>
  );
};
