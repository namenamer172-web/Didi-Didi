import React from 'react';
import { X, CheckCircle, Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';
import { NotificationItem } from '../../types/instagram';

interface NotificationDrawerProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm md:max-w-md h-full bg-white dark:bg-black border-l border-neutral-200 dark:border-neutral-800 p-4 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
            Notifications
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-semibold text-sky-500 hover:text-sky-600 dark:text-sky-400"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of notifications */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900 py-2">
          {notifications.map((item) => (
            <div 
              key={item.id} 
              className={`py-3 px-2 flex items-center justify-between gap-3 rounded-lg transition-colors ${
                !item.isRead ? 'bg-sky-50/60 dark:bg-sky-950/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <img
                      src={item.actor.avatar}
                      alt={item.actor.username}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Icon badge */}
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] ${
                    item.type === 'like' ? 'bg-rose-500' :
                    item.type === 'comment' ? 'bg-sky-500' :
                    item.type === 'follow' ? 'bg-violet-500' : 'bg-amber-500'
                  }`}>
                    {item.type === 'like' && <Heart className="w-2.5 h-2.5 fill-current" />}
                    {item.type === 'comment' && <MessageCircle className="w-2.5 h-2.5 fill-current" />}
                    {item.type === 'follow' && <UserPlus className="w-2.5 h-2.5" />}
                    {item.type === 'mention' && <AtSign className="w-2.5 h-2.5" />}
                  </span>
                </div>

                <div className="text-xs leading-snug">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1">
                    {item.actor.username}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-300">
                    {item.text}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    {item.createdAt}
                  </span>
                </div>
              </div>

              {item.postPreviewUrl ? (
                <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200 dark:border-neutral-800">
                  <img
                    src={item.postPreviewUrl}
                    alt="Post thumbnail"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <button className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-[11px] rounded-lg shrink-0">
                  Follow
                </button>
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-16 text-neutral-400">
              <CheckCircle className="w-10 h-10 mx-auto stroke-[1.5] mb-2 text-neutral-400" />
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">No new notifications</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
