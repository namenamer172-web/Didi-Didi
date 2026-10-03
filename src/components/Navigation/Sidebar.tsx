import React from 'react';
import { 
  Home, 
  Search, 
  Compass, 
  Film, 
  Send, 
  Heart, 
  PlusSquare, 
  User as UserIcon, 
  Moon, 
  Sun,
  Instagram
} from 'lucide-react';
import { User } from '../../types/instagram';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCreateModal: () => void;
  openNotifications: () => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  openCreateModal,
  openNotifications,
  unreadNotificationsCount,
  unreadMessagesCount,
  isDarkMode,
  setIsDarkMode,
  currentUser,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'reels', label: 'Reels', icon: Film },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: Send, 
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Heart, 
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      onClick: openNotifications
    },
    { 
      id: 'create', 
      label: 'Create', 
      icon: PlusSquare, 
      onClick: openCreateModal 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: UserIcon, 
      isAvatar: true 
    },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[72px] xl:w-60 h-screen border-r border-[#dbdbdb] dark:border-[#262626] bg-white dark:bg-black z-30 px-3 py-6 transition-all duration-200">
      {/* Brand Wordmark */}
      <div className="px-3 mb-8">
        <button 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Instagram className="w-5 h-5" />
          </div>
          <span className="hidden xl:block font-script italic text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            InstaVibe
          </span>
        </button>
      </div>

      {/* Nav items list */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  setCurrentTab(item.id);
                }
              }}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 relative group ${
                isActive 
                  ? 'font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900' 
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/60'
              }`}
            >
              <div className="relative shrink-0 flex items-center justify-center">
                {item.isAvatar ? (
                  <div className={`w-6 h-6 rounded-full overflow-hidden border ${isActive ? 'border-neutral-900 dark:border-white ring-1 ring-neutral-900 dark:ring-white' : 'border-neutral-300 dark:border-neutral-700'}`}>
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <Icon className={`w-6 h-6 transition-transform group-hover:scale-105 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
                )}
                
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`hidden xl:inline text-sm truncate ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Dark mode & Settings footer */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
        <button
          onClick={() => setIsDarkMode((prev: boolean) => !prev)}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-amber-400 shrink-0" />
          ) : (
            <Moon className="w-6 h-6 text-neutral-700 shrink-0" />
          )}
          <span className="hidden xl:inline text-sm">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </aside>
  );
};
