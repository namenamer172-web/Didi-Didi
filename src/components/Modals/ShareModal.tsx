import React, { useState } from 'react';
import { X, Link2, Check, Send, Search } from 'lucide-react';
import { Post, User } from '../../types/instagram';

interface ShareModalProps {
  post: Post | null;
  users: User[];
  onClose: () => void;
  onSendToUser: (recipientId: string, post: Post) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  post,
  users,
  onClose,
  onSendToUser,
}) => {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [sentUserIds, setSentUserIds] = useState<string[]>([]);

  if (!post) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${post.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToContact = (userId: string) => {
    onSendToUser(userId, post);
    setSentUserIds(prev => [...prev, userId]);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="w-5" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Share
          </h3>
          <button 
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people..."
              className="w-full text-xs bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Direct Contacts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-60">
          {filteredUsers.map((user) => {
            const hasSent = sentUserIds.includes(user.id);

            return (
              <div key={user.id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {user.username}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {user.name}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSendContact(user.id)}
                  disabled={hasSent}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    hasSent 
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500' 
                      : 'bg-sky-500 hover:bg-sky-600 text-white'
                  }`}
                >
                  {hasSent ? 'Sent' : 'Send'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                <span>Copy link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  function handleSendContact(userId: string) {
    handleSendToContact(userId);
  }
};
