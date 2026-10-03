import React, { useState } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  Heart, 
  Smile, 
  Mic, 
  Play, 
  Pause, 
  Phone, 
  Video, 
  Info,
  BadgeCheck
} from 'lucide-react';
import { Conversation, User, DirectMessage } from '../../types/instagram';

interface DirectMessagesProps {
  conversations: Conversation[];
  currentUser: User;
  onSendMessage: (conversationId: string, text: string) => void;
  onReactMessage: (conversationId: string, messageId: string, emoji: string) => void;
}

export const DirectMessages: React.FC<DirectMessagesProps> = ({
  conversations,
  currentUser,
  onSendMessage,
  onReactMessage,
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;
    onSendMessage(activeConversation.id, inputText.trim());
    setInputText('');
  };

  const handleSendHeart = () => {
    if (!activeConversation) return;
    onSendMessage(activeConversation.id, '❤️');
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[86vh] max-h-[750px] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex shadow-lg">
      
      {/* Left Column: Conversations List */}
      <div className="w-full md:w-80 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              {currentUser.username}
            </span>
          </div>
          <span className="text-xs text-neutral-500 font-medium">Messages</span>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900">
          {conversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${
                  isActive 
                    ? 'bg-neutral-100 dark:bg-neutral-900' 
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <img
                      src={conv.participant.avatar}
                      alt={conv.participant.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {conv.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {conv.participant.username}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {conv.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {conv.lastMessage}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Conversation */}
      {activeConversation ? (
        <div className="hidden md:flex flex-1 flex-col h-full bg-white dark:bg-black">
          {/* Top Chat Header */}
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  <img
                    src={activeConversation.participant.avatar}
                    alt={activeConversation.participant.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {activeConversation.participant.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {activeConversation.participant.name}
                  </span>
                  {activeConversation.participant.isVerified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-sky-500 fill-sky-500 text-white" />
                  )}
                </div>
                <span className="text-[11px] text-neutral-400">
                  {activeConversation.participant.isOnline ? 'Active now' : 'Active 2h ago'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
              <button className="p-2 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Bubble Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeConversation.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="relative group max-w-[70%]">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-sky-500 text-white rounded-br-xs'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}

                      {/* Voice Note Simulation */}
                      {msg.audioSeconds && (
                        <div className="flex items-center gap-3 py-1">
                          <button
                            onClick={() => setIsPlayingAudio(prev => !prev)}
                            className="w-7 h-7 rounded-full bg-white text-sky-500 flex items-center justify-center shrink-0 shadow-xs"
                          >
                            {isPlayingAudio ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                          </button>
                          <div className="flex items-center gap-1 h-4">
                            {[12, 24, 16, 32, 20, 28, 14, 22].map((height, i) => (
                              <div 
                                key={i} 
                                className={`w-1 bg-white/70 rounded-full transition-all ${isPlayingAudio ? 'animate-pulse' : ''}`}
                                style={{ height: `${height * 0.5}px` }} 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-white/90">0:14</span>
                        </div>
                      )}
                    </div>

                    {/* Reaction badges */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="absolute -bottom-2 right-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-full px-1.5 py-0.5 text-[10px] shadow-xs flex items-center gap-0.5">
                        {msg.reactions.map((r, i) => (
                          <span key={i}>{r}</span>
                        ))}
                      </div>
                    )}

                    {/* Hover Reaction trigger */}
                    <button
                      onClick={() => onReactMessage(activeConversation.id, msg.id, '❤️')}
                      className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-neutral-400 hover:text-rose-500 ${
                        isMe ? '-left-7' : '-right-7'
                      }`}
                      title="Heart reaction"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 px-1">
                    {msg.createdAt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Message Input Bottom Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-full px-4 py-2 border border-neutral-200 dark:border-neutral-800">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message..."
                className="flex-1 text-xs md:text-sm bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
              />
              <button type="button" className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button type="button" className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white">
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {inputText.trim() ? (
              <button
                type="submit"
                className="p-2 text-sky-500 hover:text-sky-600 dark:text-sky-400 font-semibold text-xs"
              >
                Send
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendHeart}
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-rose-500 transition-colors"
              >
                <Heart className="w-6 h-6 stroke-[1.8]" />
              </button>
            )}
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 text-neutral-400">
          <Send className="w-16 h-16 stroke-[1] mb-2" />
          <h4 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">Your Messages</h4>
          <p className="text-xs max-w-xs mt-1">Send private photos and messages to a friend or group.</p>
        </div>
      )}
    </div>
  );
};
