import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  BadgeCheck, 
  Smile 
} from 'lucide-react';
import { Post, User } from '../../types/instagram';

interface PostDetailModalProps {
  post: Post | null;
  currentUser: User;
  onClose: () => void;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCommentLikeToggle: (postId: string, commentId: string) => void;
  onOpenShareModal: (post: Post) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  currentUser,
  onClose,
  onLikeToggle,
  onSaveToggle,
  onAddComment,
  onCommentLikeToggle,
  onOpenShareModal,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!post) return null;

  const currentMedia = post.media[0];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleAddEmoji = (emoji: string) => {
    setCommentText(prev => prev + emoji);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 md:p-6"
      onClick={onClose}
    >
      {/* Close button top right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-black/40 hover:bg-black/60 z-50 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div 
        className="bg-white dark:bg-black w-full max-w-5xl h-[92vh] max-h-[780px] rounded-2xl md:rounded-r-none md:rounded-l-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-neutral-200 dark:border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Media Area */}
        <div className="relative md:w-3/5 bg-black flex items-center justify-center overflow-hidden h-[45%] md:h-full">
          <img
            src={currentMedia.url}
            alt={post.caption}
            className="w-full h-full object-contain md:object-cover"
            style={{ filter: currentMedia.filter || 'none' }}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right: Comments & Interaction Column */}
        <div className="md:w-2/5 flex flex-col h-[55%] md:h-full bg-white dark:bg-black border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800">
          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {post.author.username}
                  </span>
                  {post.author.isVerified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-sky-500 fill-sky-500 text-white" />
                  )}
                </div>
                {post.location && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {post.location}
                  </span>
                )}
              </div>
            </div>

            <button className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Comments & Caption Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Author caption as first comment */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-neutral-900 dark:text-neutral-100 leading-relaxed">
                  <span className="font-semibold mr-1.5">{post.author.username}</span>
                  <span className="whitespace-pre-line">{post.caption}</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  {post.createdAt}
                </div>
              </div>
            </div>

            {/* List of comments */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                  <img
                    src={comment.userAvatar}
                    alt={comment.username}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-neutral-900 dark:text-neutral-100 leading-relaxed">
                    <span className="font-semibold mr-1.5">{comment.username}</span>
                    <span>{comment.text}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span>{comment.createdAt}</span>
                    {comment.likesCount > 0 && (
                      <span className="font-medium text-neutral-500">{comment.likesCount} likes</span>
                    )}
                    <button 
                      onClick={() => setCommentText(`@${comment.username} `)}
                      className="hover:text-neutral-600 dark:hover:text-neutral-300 font-semibold"
                    >
                      Reply
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onCommentLikeToggle(post.id, comment.id)}
                  className="p-1 text-neutral-400 hover:text-rose-500 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
                </button>
              </div>
            ))}

            {post.comments.length === 0 && (
              <div className="text-center py-8 text-neutral-400">
                <p className="font-semibold text-sm text-neutral-700 dark:text-neutral-300">No comments yet.</p>
                <p className="text-xs mt-1">Start the conversation.</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 shrink-0 bg-white dark:bg-black">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onLikeToggle(post.id)}
                  className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-500 transition-transform active:scale-125"
                >
                  <Heart 
                    className={`w-6 h-6 ${
                      post.isLiked ? 'text-rose-600 fill-rose-600' : ''
                    }`} 
                  />
                </button>

                <button 
                  onClick={() => document.getElementById('modal-comment-input')?.focus()}
                  className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-500"
                >
                  <MessageCircle className="w-6 h-6 -rotate-90" />
                </button>

                <button
                  onClick={() => onOpenShareModal(post)}
                  className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-500"
                >
                  <Send className="w-6 h-6 -rotate-12" />
                </button>
              </div>

              <button
                onClick={() => onSaveToggle(post.id)}
                className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-500"
              >
                <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-current text-neutral-900 dark:text-white' : ''}`} />
              </button>
            </div>

            <div className="mb-1">
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                {post.likesCount.toLocaleString()} likes
              </span>
            </div>

            <div className="text-[10px] text-neutral-400 uppercase tracking-wide">
              {post.createdAt}
            </div>

            {/* Emoji quick bar toggle */}
            {showEmojiPicker && (
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-900 mt-2">
                {['❤️', '🙌', '🔥', '👏', '😍', '😂', '🎉', '💯'].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleAddEmoji(emoji)}
                    className="text-lg hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Comment form */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-900">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(prev => !prev)}
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                <Smile className="w-5 h-5" />
              </button>
              <input
                id="modal-comment-input"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 text-xs bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="text-xs font-semibold text-sky-500 disabled:opacity-40 hover:text-sky-600 dark:text-sky-400 px-2 py-1"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
