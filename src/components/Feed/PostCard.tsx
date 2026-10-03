import React, { useState, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Music2, 
  ChevronLeft, 
  ChevronRight,
  Smile,
  BadgeCheck
} from 'lucide-react';
import { Post, User } from '../../types/instagram';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCommentLikeToggle?: (postId: string, commentId: string) => void;
  onOpenDetailModal: (post: Post) => void;
  onOpenShareModal: (post: Post) => void;
  onSelectUserStory?: (authorId: string) => void;
  hasStory?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLikeToggle,
  onSaveToggle,
  onAddComment,
  onCommentLikeToggle,
  onOpenDetailModal,
  onOpenShareModal,
  onSelectUserStory,
  hasStory,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const lastTapRef = useRef<number>(0);

  const currentMedia = post.media[currentMediaIndex] || post.media[0];

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        onLikeToggle(post.id);
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 900);
    }
    lastTapRef.current = now;
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const addQuickEmoji = (emoji: string) => {
    setCommentInput(prev => prev + emoji);
  };

  return (
    <article className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl md:rounded-xl overflow-hidden mb-5 transition-shadow hover:shadow-xs">
      {/* Post Header */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => hasStory && onSelectUserStory && onSelectUserStory(post.author.id)}
            className="group focus:outline-none"
          >
            <div className={`w-9 h-9 rounded-full p-[2px] transition-transform ${
              hasStory ? 'story-gradient-ring' : 'border border-neutral-200 dark:border-neutral-800'
            }`}>
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-full h-full rounded-full object-cover bg-neutral-100 dark:bg-neutral-900"
                referrerPolicy="no-referrer"
              />
            </div>
          </button>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer">
                {post.author.username}
              </span>
              {post.author.isVerified && (
                <BadgeCheck className="w-4 h-4 text-sky-500 fill-sky-500 text-white" />
              )}
              <span className="text-xs text-neutral-500 dark:text-neutral-400">· {post.createdAt}</span>
            </div>

            {post.location && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
                {post.location}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowOptionsModal(true)}
          className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Audio badge if present */}
      {post.audioTrack && (
        <div className="px-4 py-1.5 bg-neutral-50 dark:bg-neutral-900/40 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <Music2 className="w-3.5 h-3.5 text-neutral-500 animate-pulse" />
          <span className="truncate">
            {post.audioTrack.title} · {post.audioTrack.artist}
          </span>
        </div>
      )}

      {/* Media with Double-Tap Interaction */}
      <div 
        className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-900 select-none overflow-hidden cursor-pointer"
        onClick={handleDoubleTap}
      >
        <img
          src={currentMedia.url}
          alt={post.caption}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ filter: currentMedia.filter || 'none' }}
          referrerPolicy="no-referrer"
        />

        {/* Big Heart pop animation on double tap */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-24 h-24 text-white fill-white drop-shadow-xl animate-heart-burst" />
          </div>
        )}

        {/* Carousel slide controls */}
        {post.media.length > 1 && (
          <>
            {currentMediaIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex(prev => prev - 1);
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {currentMediaIndex < post.media.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex(prev => prev + 1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Pagination dots */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
              {post.media.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentMediaIndex ? 'bg-sky-400 w-3' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Bar */}
      <div className="px-3.5 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLikeToggle(post.id)}
              className="group focus:outline-none transition-transform active:scale-125"
              aria-label={post.isLiked ? "Unlike post" : "Like post"}
            >
              <Heart 
                className={`w-6 h-6 transition-colors ${
                  post.isLiked 
                    ? 'text-rose-600 fill-rose-600 scale-105' 
                    : 'text-neutral-800 dark:text-neutral-200 hover:text-neutral-500'
                }`} 
              />
            </button>

            <button
              onClick={() => onOpenDetailModal(post)}
              className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-500 transition-colors"
              aria-label="Comment"
            >
              <MessageCircle className="w-6 h-6 -rotate-90" />
            </button>

            <button
              onClick={() => onOpenShareModal(post)}
              className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-500 transition-colors"
              aria-label="Share"
            >
              <Send className="w-6 h-6 -rotate-12" />
            </button>
          </div>

          <button
            onClick={() => onSaveToggle(post.id)}
            className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-500 transition-colors active:scale-110"
            aria-label={post.isSaved ? "Unsave" : "Save"}
          >
            <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-current text-neutral-900 dark:text-white' : ''}`} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="mb-2">
          <button 
            onClick={() => onOpenDetailModal(post)}
            className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:opacity-80"
          >
            {post.likesCount.toLocaleString()} likes
          </button>
        </div>

        {/* Caption & Hashtags */}
        <div className="text-sm text-neutral-900 dark:text-neutral-100 leading-snug mb-2">
          <span className="font-semibold mr-1.5">{post.author.username}</span>
          <span className="whitespace-pre-line">
            {isCaptionExpanded ? post.caption : post.caption.slice(0, 110)}
          </span>
          {post.caption.length > 110 && !isCaptionExpanded && (
            <button
              onClick={() => setIsCaptionExpanded(true)}
              className="ml-1 text-xs text-neutral-500 dark:text-neutral-400 hover:underline font-medium"
            >
              ... more
            </button>
          )}
        </div>

        {/* Comments count preview */}
        {post.comments.length > 0 && (
          <div className="space-y-1 mb-2">
            {post.comments.length > 2 && (
              <button
                onClick={() => onOpenDetailModal(post)}
                className="text-xs text-neutral-500 dark:text-neutral-400 hover:underline block"
              >
                View all {post.comments.length} comments
              </button>
            )}

            {/* Display up to 2 recent comments */}
            {post.comments.slice(-2).map((comment) => (
              <div key={comment.id} className="flex items-center justify-between text-xs text-neutral-800 dark:text-neutral-200">
                <div className="truncate pr-2">
                  <span className="font-semibold mr-1.5">{comment.username}</span>
                  <span>{comment.text}</span>
                </div>
                <button
                  onClick={() => onCommentLikeToggle && onCommentLikeToggle(post.id, comment.id)}
                  className="p-1 text-neutral-400 hover:text-rose-500 shrink-0"
                >
                  <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick Emoji bar */}
        <div className="flex items-center gap-2 py-1 text-sm border-t border-neutral-100 dark:border-neutral-900">
          {['❤️', '🙌', '🔥', '👏', '😍'].map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => addQuickEmoji(emoji)}
              className="hover:scale-120 transition-transform focus:outline-none"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Inline Add Comment Input */}
        <form onSubmit={handleCommentSubmit} className="flex items-center justify-between pt-1 pb-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className="w-full text-xs bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none py-1"
          />
          {commentInput.trim() && (
            <button
              type="submit"
              className="text-xs font-semibold text-sky-500 hover:text-sky-600 dark:text-sky-400 px-2 py-1 shrink-0"
            >
              Post
            </button>
          )}
        </form>
      </div>

      {/* Options Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800 text-sm text-center">
            <button
              onClick={() => {
                onOpenShareModal(post);
                setShowOptionsModal(false);
              }}
              className="w-full py-3.5 font-semibold text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Share to...
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShowOptionsModal(false);
              }}
              className="w-full py-3.5 font-semibold text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Copy link
            </button>
            <button
              onClick={() => {
                onSaveToggle(post.id);
                setShowOptionsModal(false);
              }}
              className="w-full py-3.5 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              {post.isSaved ? 'Remove from saved' : 'Save post'}
            </button>
            <button
              onClick={() => setShowOptionsModal(false)}
              className="w-full py-3.5 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
