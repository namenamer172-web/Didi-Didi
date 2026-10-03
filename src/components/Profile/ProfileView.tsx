import React, { useState } from 'react';
import { 
  Grid, 
  Film, 
  Bookmark, 
  UserCheck, 
  Settings, 
  BadgeCheck, 
  ExternalLink, 
  Heart, 
  MessageCircle,
  Plus
} from 'lucide-react';
import { User, Post, Reel } from '../../types/instagram';
import { HIGHLIGHTS } from '../../data/mockData';

interface ProfileViewProps {
  user: User;
  currentUser: User;
  posts: Post[];
  reels: Reel[];
  onSelectPost: (post: Post) => void;
  onUpdateProfile: (updated: Partial<User>) => void;
  onOpenCreateModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  posts,
  reels,
  onSelectPost,
  onUpdateProfile,
  onOpenCreateModal,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved' | 'tagged'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editWebsite, setEditWebsite] = useState(user.website || '');

  const isMe = user.id === currentUser.id;

  // Filter user's posts
  const userPosts = posts.filter(p => p.author.id === user.id);
  const savedPosts = posts.filter(p => p.isSaved);
  const userReels = reels.filter(r => r.author.id === user.id || isMe);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      bio: editBio,
      website: editWebsite,
    });
    setShowEditModal(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-14">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-[3px] story-gradient-ring">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-black p-0.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          {/* Row 1: Username & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {user.username}
              </h2>
              {user.isVerified && (
                <BadgeCheck className="w-5 h-5 text-sky-500 fill-sky-500 text-white" />
              )}
            </div>

            <div className="flex items-center gap-2">
              {isMe ? (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Edit profile
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    className="px-4 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Share profile
                  </button>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button className="px-6 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg shadow-sm">
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Metrics Counters */}
          <div className="flex items-center justify-center md:justify-start gap-8 text-sm">
            <div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 mr-1 tabular-nums">
                {userPosts.length}
              </span>
              <span className="text-neutral-600 dark:text-neutral-400">posts</span>
            </div>
            <div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 mr-1 tabular-nums">
                {user.followersCount.toLocaleString()}
              </span>
              <span className="text-neutral-600 dark:text-neutral-400">followers</span>
            </div>
            <div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 mr-1 tabular-nums">
                {user.followingCount.toLocaleString()}
              </span>
              <span className="text-neutral-600 dark:text-neutral-400">following</span>
            </div>
          </div>

          {/* Row 3: Name & Bio */}
          <div className="space-y-1 text-xs md:text-sm">
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
              {user.name}
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
              {user.bio}
            </p>
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium hover:underline pt-0.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {user.website.replace('https://', '')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Story Highlights */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pt-2 pb-2">
        {HIGHLIGHTS.map((hl) => (
          <div key={hl.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div className="w-16 h-16 rounded-full p-[2px] border border-neutral-300 dark:border-neutral-700 group-hover:scale-105 transition-transform">
              <img
                src={hl.cover}
                alt={hl.title}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
              {hl.title}
            </span>
          </div>
        ))}

        {isMe && (
          <div 
            onClick={onOpenCreateModal}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              <Plus className="w-6 h-6 stroke-[1.5]" />
            </div>
            <span className="text-xs font-medium text-neutral-500">New</span>
          </div>
        )}
      </div>

      {/* Content Navigation Tabs */}
      <div className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-center gap-8 md:gap-14">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider border-t-2 -mt-[1px] transition-colors ${
              activeTab === 'posts'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts</span>
          </button>

          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider border-t-2 -mt-[1px] transition-colors ${
              activeTab === 'reels'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Reels</span>
          </button>

          {isMe && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider border-t-2 -mt-[1px] transition-colors ${
                activeTab === 'saved'
                  ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('tagged')}
            className={`flex items-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider border-t-2 -mt-[1px] transition-colors ${
              activeTab === 'tagged'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Tagged</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {userPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-sm md:rounded-lg bg-neutral-100 dark:bg-neutral-900"
            >
              <img
                src={post.media[0].url}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                style={{ filter: post.media[0].filter || 'none' }}
                referrerPolicy="no-referrer"
              />

              {/* Hover overlay with Like and Comment counts */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-semibold text-sm">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {savedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-sm md:rounded-lg bg-neutral-100 dark:bg-neutral-900"
            >
              <img
                src={post.media[0].url}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                style={{ filter: post.media[0].filter || 'none' }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-semibold text-sm">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{post.likesCount}</span>
                </div>
              </div>
            </div>
          ))}
          {savedPosts.length === 0 && (
            <div className="col-span-3 text-center py-16 text-neutral-400">
              <Bookmark className="w-10 h-10 mx-auto stroke-[1.5] mb-2 text-neutral-500" />
              <p className="font-semibold text-sm text-neutral-700 dark:text-neutral-300">Save photos and videos</p>
              <p className="text-xs mt-1">Save items that you want to see again. No one is notified.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {userReels.map((reel) => (
            <div
              key={reel.id}
              className="relative aspect-9/16 group cursor-pointer overflow-hidden rounded-sm md:rounded-lg bg-black"
            >
              <img
                src={reel.mediaUrl}
                alt={reel.caption}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>{reel.likesCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tagged' && (
        <div className="text-center py-16 text-neutral-400">
          <UserCheck className="w-12 h-12 mx-auto stroke-[1.5] mb-2 text-neutral-500" />
          <p className="font-semibold text-sm text-neutral-700 dark:text-neutral-300">Photos of you</p>
          <p className="text-xs mt-1">When people tag you in photos, they'll appear here.</p>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Edit profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                  Website
                </label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-lg shadow-sm"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
