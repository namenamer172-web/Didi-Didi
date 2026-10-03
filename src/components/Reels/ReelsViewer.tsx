import React, { useState, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Music, 
  BadgeCheck 
} from 'lucide-react';
import { Reel, User } from '../../types/instagram';

interface ReelsViewerProps {
  reels: Reel[];
  currentUser: User;
  onLikeToggle: (reelId: string) => void;
  onSaveToggle: (reelId: string) => void;
  onShareReel: (reel: Reel) => void;
}

export const ReelsViewer: React.FC<ReelsViewerProps> = ({
  reels,
  currentUser,
  onLikeToggle,
  onSaveToggle,
  onShareReel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const lastTapRef = useRef<number>(0);

  const activeReel = reels[currentIndex] || reels[0];

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!activeReel.isLiked) {
        onLikeToggle(activeReel.id);
      }
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
    lastTapRef.current = now;
  };

  if (!activeReel) return null;

  return (
    <div className="w-full flex items-center justify-center py-2 md:py-6 px-2">
      {/* Reel container */}
      <div className="relative w-full max-w-[390px] h-[82vh] max-h-[720px] bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center select-none border border-neutral-800">
        
        {/* Background Visual Asset / Simulated Video Media */}
        <div 
          className="relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={handleDoubleTap}
        >
          <img
            src={activeReel.mediaUrl}
            alt={activeReel.caption}
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Subtle gradient overlays for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

          {/* Double Tap Heart Burst */}
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-xl animate-heart-burst" />
            </div>
          )}

          {/* Sound Mute Toggle top right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(prev => !prev);
            }}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Metadata Overlay */}
        <div className="absolute bottom-4 left-4 right-16 z-20 text-white space-y-2.5">
          {/* User Profile Info */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/60">
              <img
                src={activeReel.author.avatar}
                alt={activeReel.author.username}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-semibold flex items-center gap-1">
              {activeReel.author.username}
              {activeReel.author.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-sky-400 fill-sky-400 text-white" />
              )}
            </span>
            <button className="text-[11px] font-semibold border border-white/60 px-2.5 py-0.5 rounded-md hover:bg-white hover:text-black transition-colors">
              Follow
            </button>
          </div>

          {/* Caption */}
          <p className="text-xs leading-relaxed text-white/90 line-clamp-2">
            {activeReel.caption}
          </p>

          {/* Audio Ticker */}
          <div className="flex items-center gap-2 text-[11px] text-white/80">
            <Music className="w-3.5 h-3.5 animate-bounce shrink-0" />
            <span className="truncate">
              {activeReel.audioTitle} · {activeReel.audioArtist}
            </span>
          </div>
        </div>

        {/* Right Action Rail */}
        <div className="absolute bottom-6 right-3 z-20 flex flex-col items-center gap-5 text-white">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onLikeToggle(activeReel.id)}
              className="p-1 hover:scale-115 active:scale-90 transition-transform"
            >
              <Heart 
                className={`w-7 h-7 drop-shadow-md transition-colors ${
                  activeReel.isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'
                }`} 
              />
            </button>
            <span className="text-[11px] font-medium drop-shadow">
              {activeReel.likesCount.toLocaleString()}
            </span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setShowCommentsDrawer(prev => !prev)}
              className="p-1 hover:scale-115 active:scale-90 transition-transform"
            >
              <MessageCircle className="w-7 h-7 drop-shadow-md text-white -rotate-90" />
            </button>
            <span className="text-[11px] font-medium drop-shadow">
              {activeReel.commentsCount.toLocaleString()}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onShareReel(activeReel)}
              className="p-1 hover:scale-115 active:scale-90 transition-transform"
            >
              <Send className="w-7 h-7 drop-shadow-md text-white -rotate-12" />
            </button>
            <span className="text-[11px] font-medium drop-shadow">
              {activeReel.sharesCount.toLocaleString()}
            </span>
          </div>

          {/* Save */}
          <button
            onClick={() => onSaveToggle(activeReel.id)}
            className="p-1 hover:scale-115 active:scale-90 transition-transform"
          >
            <Bookmark className={`w-7 h-7 drop-shadow-md ${activeReel.isSaved ? 'text-white fill-white' : 'text-white'}`} />
          </button>

          {/* Spinning Audio Album Cover */}
          <div className="w-8 h-8 rounded-full border-2 border-white/80 overflow-hidden animate-spin [animation-duration:6s] mt-1 shadow-md">
            <img
              src={activeReel.author.avatar}
              alt="Track"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Up / Down Navigation Buttons (Desktop Helper) */}
        <div className="hidden md:flex flex-col gap-2 absolute -right-14 top-1/2 -translate-y-1/2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 disabled:opacity-30 text-neutral-800 dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors shadow-md"
            title="Previous Reel"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === reels.length - 1}
            className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 disabled:opacity-30 text-neutral-800 dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors shadow-md"
            title="Next Reel"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
