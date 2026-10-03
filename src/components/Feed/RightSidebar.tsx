import React from 'react';
import { User } from '../../types/instagram';
import { BadgeCheck } from 'lucide-react';

interface RightSidebarProps {
  currentUser: User;
  suggestedUsers: User[];
  onToggleFollow: (userId: string) => void;
  onSelectUserProfile: (user: User) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentUser,
  suggestedUsers,
  onToggleFollow,
  onSelectUserProfile,
}) => {
  return (
    <aside className="hidden lg:block w-80 shrink-0 pl-8 pt-4">
      {/* Current user card */}
      <div className="flex items-center justify-between mb-6">
        <div 
          onClick={() => onSelectUserProfile(currentUser)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:underline">
              {currentUser.username}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {currentUser.name}
            </span>
          </div>
        </div>

        <button 
          onClick={() => onSelectUserProfile(currentUser)}
          className="text-xs font-semibold text-sky-500 hover:text-sky-600 dark:text-sky-400"
        >
          Switch
        </button>
      </div>

      {/* Suggested for you header */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-semibold text-neutral-500 dark:text-neutral-400">
          Suggested for you
        </span>
        <button className="font-semibold text-neutral-900 dark:text-neutral-100 hover:opacity-70">
          See All
        </button>
      </div>

      {/* Suggested list */}
      <div className="space-y-3 mb-6">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div 
              onClick={() => onSelectUserProfile(user)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:underline">
                    {user.username}
                  </span>
                  {user.isVerified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-sky-500 fill-sky-500 text-white" />
                  )}
                </div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[140px]">
                  {user.bio || 'Suggested for you'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onToggleFollow(user.id)}
              className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                user.isFollowing
                  ? 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  : 'text-sky-500 hover:text-sky-600 dark:text-sky-400'
              }`}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>

      {/* Footer links (anti-slop clean typography) */}
      <div className="text-[11px] text-neutral-400 dark:text-neutral-500 space-y-3 leading-relaxed">
        <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
          <span>About</span>
          <span>·</span>
          <span>Help</span>
          <span>·</span>
          <span>Press</span>
          <span>·</span>
          <span>API</span>
          <span>·</span>
          <span>Jobs</span>
          <span>·</span>
          <span>Privacy</span>
          <span>·</span>
          <span>Terms</span>
          <span>·</span>
          <span>Locations</span>
          <span>·</span>
          <span>Language</span>
        </div>
        <p className="uppercase tracking-wider text-[10px]">
          © 2026 INSTAVIBE BY AI STUDIO
        </p>
      </div>
    </aside>
  );
};
