import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Volume2, VolumeX, Pause, Play, Send, Heart } from 'lucide-react';
import { Story } from '../../types/instagram';

interface StoryViewerModalProps {
  stories: Story[];
  initialStoryId: string;
  onClose: () => void;
  onReplyToStory: (recipientId: string, replyText: string) => void;
  onStoryViewed: (storyId: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialStoryId,
  onClose,
  onReplyToStory,
  onStoryViewed,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(() => {
    const idx = stories.findIndex(s => s.id === initialStoryId);
    return idx !== -1 ? idx : 0;
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);

  const currentStory = stories[currentStoryIndex];
  const currentSlide = currentStory?.slides[currentSlideIndex];
  const slideDurationMs = 5000;
  const progressIntervalMs = 50;

  // Mark story as viewed
  useEffect(() => {
    if (currentStory) {
      onStoryViewed(currentStory.id);
    }
  }, [currentStoryIndex, currentStory, onStoryViewed]);

  const handleNext = useCallback(() => {
    if (!currentStory) return;
    if (currentSlideIndex < currentStory.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentSlideIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentStory, currentSlideIndex, currentStoryIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      const prevStory = stories[currentStoryIndex - 1];
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentSlideIndex(prevStory.slides.length - 1);
      setProgress(0);
    }
  }, [currentSlideIndex, currentStoryIndex, stories]);

  // Timer loop for auto advancement
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        const step = (progressIntervalMs / slideDurationMs) * 100;
        const next = prev + step;
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, progressIntervalMs);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') setIsPaused(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  const triggerReaction = (emoji: string) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: 30 + Math.random() * 40,
    };
    setFloatingReactions(prev => [...prev, newReaction]);
    onReplyToStory(currentStory.author.id, `Reacted ${emoji} to your story`);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 1200);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentStory) return;
    onReplyToStory(currentStory.author.id, `Replying to story: "${replyText.trim()}"`);
    setReplyText('');
    triggerReaction('💬');
  };

  if (!currentStory || !currentSlide) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-4 select-none">
      {/* Top close button outside on desktop */}
      <button
        onClick={onClose}
        className="hidden md:flex absolute top-6 right-6 p-2 text-white/80 hover:text-white rounded-full bg-neutral-900/80 hover:bg-neutral-800 transition-colors z-50"
        title="Close (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Story card container */}
      <div 
        className="relative w-full md:max-w-[420px] h-full md:h-[92vh] max-h-[850px] bg-neutral-900 rounded-none md:rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress bars header */}
        <div className="absolute top-0 inset-x-0 z-20 p-3 bg-gradient-to-b from-black/70 via-black/30 to-transparent">
          <div className="flex gap-1.5 mb-2.5">
            {currentStory.slides.map((slide, idx) => {
              let width = '0%';
              if (idx < currentSlideIndex) width = '100%';
              else if (idx === currentSlideIndex) width = `${progress}%`;

              return (
                <div key={slide.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all ease-linear"
                    style={{ width, transitionDuration: idx === currentSlideIndex ? `${progressIntervalMs}ms` : '0ms' }}
                  />
                </div>
              );
            })}
          </div>

          {/* Author info & controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/60">
                <img
                  src={currentStory.author.avatar}
                  alt={currentStory.author.username}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold">{currentStory.author.username}</span>
                <span className="text-[11px] text-white/70">· {currentSlide.createdAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(prev => !prev);
                }}
                className="p-1.5 text-white/80 hover:text-white"
                title={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(prev => !prev);
                }}
                className="p-1.5 text-white/80 hover:text-white"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="md:hidden p-1.5 text-white/80 hover:text-white"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Media content */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black">
          <img
            src={currentSlide.mediaUrl}
            alt="Story media"
            className="w-full h-full object-cover"
            style={{ filter: currentSlide.filter || 'none' }}
            referrerPolicy="no-referrer"
          />

          {/* Slide caption sticker */}
          {currentSlide.caption && (
            <div className="absolute bottom-20 inset-x-6 z-20 text-center">
              <span className="inline-block bg-black/60 backdrop-blur-md text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg border border-white/10">
                {currentSlide.caption}
              </span>
            </div>
          )}

          {/* Tap Zones for Left/Right navigation */}
          <div 
            className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          />
          <div 
            className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          />

          {/* Floating animated reactions */}
          {floatingReactions.map(r => (
            <div
              key={r.id}
              className="absolute pointer-events-none text-4xl animate-float-reaction z-30"
              style={{ left: `${r.x}%`, bottom: '80px' }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Bottom interaction reply bar */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2">
          {/* Quick emoji reactions */}
          <div className="flex items-center justify-around px-2 py-1">
            {['❤️', '🔥', '😂', '😮', '👏', '🥳'].map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerReaction(emoji);
                }}
                className="text-xl hover:scale-130 active:scale-95 transition-transform p-1 focus:outline-none"
              >
                {emoji}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                placeholder={`Reply to ${currentStory.author.username}...`}
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 text-xs rounded-full py-2.5 px-4 focus:outline-none focus:border-white focus:bg-white/30 transition-colors"
              />
            </div>
            {replyText.trim() ? (
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shrink-0 transition-transform active:scale-90"
              >
                <Send className="w-4 h-4 stroke-[2]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => triggerReaction('❤️')}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 transition-transform active:scale-90"
              >
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
