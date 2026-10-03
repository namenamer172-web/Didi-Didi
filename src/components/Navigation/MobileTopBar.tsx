import React from 'react';
import { Heart, Send, Moon, Sun, Instagram } from 'lucide-react';

interface MobileTopBarProps {
  openNotifications: () => void;
  openMessages: () => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onBrandClick: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  openNotifications,
  openMessages,
  unreadNotificationsCount,
  unreadMessagesCount,
  isDarkMode,
  setIsDarkMode,
  onBrandClick,
}) => {
  return (
    <header className="md:hidden sticky top-0 z-20 h-13 px-4 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
      <button 
        onClick={onBrandClick} 
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
          <Instagram className="w-4 h-4" />
        </div>
        <span className="font-script italic text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          InstaVibe
        </span>
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsDarkMode((prev: boolean) => !prev)}
          className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={openNotifications}
          className="p-2 text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white relative"
          aria-label="Notifications"
        >
          <Heart className="w-6 h-6 stroke-[1.8]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        <button
          onClick={openMessages}
          className="p-2 text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white relative"
          aria-label="Direct Messages"
        >
          <Send className="w-6 h-6 stroke-[1.8] -rotate-12" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
