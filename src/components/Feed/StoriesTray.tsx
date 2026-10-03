import React from 'react';
import { Plus } from 'lucide-react';
import { Story, User } from '../../types/instagram';

interface StoriesTrayProps {
  stories: Story[];
  currentUser: User;
  onSelectStory: (storyId: string) => void;
  onAddStory: () => void;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({
  stories,
  currentUser,
  onSelectStory,
  onAddStory,
}) => {
  const myStory = stories.find(s => s.author.id === currentUser.id);
  const otherStories = stories.filter(s => s.author.id !== currentUser.id);

  return (
    <div className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl md:rounded-xl p-3 md:p-4 mb-4 overflow-x-auto no-scrollbar shadow-xs">
      <div className="flex items-center gap-4 min-w-max">
        {/* Current user's story */}
        <div className="flex flex-col items-center gap-1.5 w-17 shrink-0">
          <div className="relative cursor-pointer group" onClick={() => myStory ? onSelectStory(myStory.id) : onAddStory()}>
            <div className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
              myStory ? 'story-gradient-ring' : 'border-2 border-dashed border-neutral-300 dark:border-neutral-700'
            }`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-black p-[2px]">
                <img
                  src={currentUser.avatar}
                  alt="Your Story"
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            {/* Plus badge */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddStory();
              }}
              className="absolute bottom-0 right-0 w-5 h-5 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-sm transition-transform active:scale-90"
              title="Add Story"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate w-full text-center">
            Your story
          </span>
        </div>

        {/* Other stories */}
        {otherStories.map((story) => (
          <button
            key={story.id}
            onClick={() => onSelectStory(story.id)}
            className="flex flex-col items-center gap-1.5 w-17 shrink-0 group focus:outline-none"
          >
            <div className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
              story.hasUnread ? 'story-gradient-ring' : 'story-gradient-ring-gray'
            }`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-black p-[2px]">
                <img
                  src={story.author.avatar}
                  alt={story.author.username}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <span className="text-xs text-neutral-800 dark:text-neutral-200 truncate w-full text-center font-medium">
              {story.author.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
