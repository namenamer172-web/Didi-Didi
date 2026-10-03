import React, { useState } from 'react';
import { Search, Heart, MessageCircle, Film, Sparkles } from 'lucide-react';
import { Post } from '../../types/instagram';

interface ExploreGridProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const ExploreGrid: React.FC<ExploreGridProps> = ({
  posts,
  onSelectPost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Architecture', 'Fashion', 'Nature', 'Food', 'Coffee', 'Design'];

  // Filter posts based on category and search query
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.location && post.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (activeCategory === 'All') return true;
    if (activeCategory === 'Architecture') return post.tags?.includes('architecture') || post.caption.includes('concrete');
    if (activeCategory === 'Fashion') return post.tags?.includes('fashion') || post.caption.includes('wool');
    if (activeCategory === 'Nature') return post.tags?.includes('mountains') || post.tags?.includes('nature');
    if (activeCategory === 'Food') return post.tags?.includes('food') || post.tags?.includes('pasta');
    if (activeCategory === 'Coffee') return post.tags?.includes('coffee') || post.caption.includes('flat white');
    if (activeCategory === 'Design') return post.tags?.includes('design') || post.caption.includes('minimalist');

    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-4 py-4 space-y-4">
      {/* Search Header */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username, tags (#architecture), or place..."
          className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs md:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Explore Mosaic Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-4 auto-rows-fr">
          {filteredPosts.map((post, idx) => {
            // Instagram bento pattern: every 6th item can be an editorial highlight
            const isFeatured = idx % 5 === 1;

            return (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className={`relative group cursor-pointer overflow-hidden rounded-md md:rounded-xl bg-neutral-200 dark:bg-neutral-900 ${
                  isFeatured ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                }`}
              >
                <img
                  src={post.media[0].url}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: post.media[0].filter || 'none' }}
                  referrerPolicy="no-referrer"
                />

                {/* Video/Carousel indicator icon top right */}
                {post.media.length > 1 && (
                  <div className="absolute top-2 right-2 text-white drop-shadow-md z-10 pointer-events-none">
                    <div className="w-5 h-5 bg-black/50 backdrop-blur-xs rounded-md flex items-center justify-center">
                      <span className="text-[10px] font-bold">1/{post.media.length}</span>
                    </div>
                  </div>
                )}

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
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 space-y-2">
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            No posts found for "{searchQuery || activeCategory}"
          </p>
          <p className="text-xs text-neutral-500">
            Try searching for another keyword or reset the category.
          </p>
        </div>
      )}
    </div>
  );
};
