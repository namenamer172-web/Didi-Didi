/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Navigation/Sidebar';
import { MobileTopBar } from './components/Navigation/MobileTopBar';
import { MobileTabBar } from './components/Navigation/MobileTabBar';
import { StoriesTray } from './components/Feed/StoriesTray';
import { PostCard } from './components/Feed/PostCard';
import { RightSidebar } from './components/Feed/RightSidebar';
import { StoryViewerModal } from './components/Feed/StoryViewerModal';
import { PostDetailModal } from './components/Feed/PostDetailModal';
import { CreatePostModal } from './components/CreatePost/CreatePostModal';
import { ExploreGrid } from './components/Explore/ExploreGrid';
import { ReelsViewer } from './components/Reels/ReelsViewer';
import { DirectMessages } from './components/Messages/DirectMessages';
import { ProfileView } from './components/Profile/ProfileView';
import { NotificationDrawer } from './components/Notifications/NotificationDrawer';
import { ShareModal } from './components/Modals/ShareModal';
import { 
  CURRENT_USER, 
  USERS, 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_REELS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { Post, Story, Reel, Conversation, NotificationItem, User } from './types/instagram';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('instavibe_dark') === 'true';
  });

  // Navigation state
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Core Data States
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('instavibe_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('instavibe_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('instavibe_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>(Object.values(USERS));

  // Modal States
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [activeDetailPost, setActiveDetailPost] = useState<Post | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sync theme to root class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('instavibe_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('instavibe_dark', 'false');
    }
  }, [isDarkMode]);

  // Persist posts
  useEffect(() => {
    localStorage.setItem('instavibe_posts', JSON.stringify(posts));
  }, [posts]);

  // Persist user
  useEffect(() => {
    localStorage.setItem('instavibe_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Sync stories
  useEffect(() => {
    localStorage.setItem('instavibe_stories', JSON.stringify(stories));
  }, [stories]);

  // Handlers for Posts
  const handleLikeToggle = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        const likesCount = isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
        
        // Add notification if liking someone else's post
        if (isLiked && p.author.id !== currentUser.id) {
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            type: 'like',
            actor: currentUser,
            postPreviewUrl: p.media[0]?.url,
            text: 'liked your post.',
            createdAt: 'Just now',
            isRead: false,
          };
          setNotifications(n => [newNotif, ...n]);
        }

        return { ...p, isLiked, likesCount };
      }
      return p;
    }));

    if (activeDetailPost && activeDetailPost.id === postId) {
      setActiveDetailPost(prev => prev ? {
        ...prev,
        isLiked: !prev.isLiked,
        likesCount: !prev.isLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1)
      } : null);
    }
  };

  const handleSaveToggle = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isSaved: !p.isSaved };
      }
      return p;
    }));

    if (activeDetailPost && activeDetailPost.id === postId) {
      setActiveDetailPost(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);
    }
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text,
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    }));

    if (activeDetailPost && activeDetailPost.id === postId) {
      setActiveDetailPost(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment],
      } : null);
    }
  };

  const handleCommentLikeToggle = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updatedComments = p.comments.map(c => {
          if (c.id === commentId) {
            const isLiked = !c.isLiked;
            return {
              ...c,
              isLiked,
              likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
            };
          }
          return c;
        });
        return { ...p, comments: updatedComments };
      }
      return p;
    }));

    if (activeDetailPost && activeDetailPost.id === postId) {
      setActiveDetailPost(prev => prev ? {
        ...prev,
        comments: prev.comments.map(c => {
          if (c.id === commentId) {
            const isLiked = !c.isLiked;
            return {
              ...c,
              isLiked,
              likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
            };
          }
          return c;
        })
      } : null);
    }
  };

  // Create post handler
  const handleCreatePost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      postsCount: prev.postsCount + 1,
    }));
    setCurrentTab('home');
  };

  // Follow / Unfollow user
  const handleToggleFollow = (userId: string) => {
    setSuggestedUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const isFollowing = !u.isFollowing;
        return { ...u, isFollowing };
      }
      return u;
    }));

    setCurrentUser(prev => ({
      ...prev,
      followingCount: prev.followingCount + 1,
    }));
  };

  // Reels handlers
  const handleReelLikeToggle = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const isLiked = !r.isLiked;
        return {
          ...r,
          isLiked,
          likesCount: isLiked ? r.likesCount + 1 : r.likesCount - 1
        };
      }
      return r;
    }));
  };

  const handleReelSaveToggle = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        return { ...r, isSaved: !r.isSaved };
      }
      return r;
    }));
  };

  // Direct messages handler
  const handleSendMessage = (conversationId: string, text: string) => {
    const newMessage = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      text,
      createdAt: 'Just now',
      isRead: true,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: text,
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMessage],
        };
      }
      return conv;
    }));

    // Simulated responsive reply after 1.8 seconds
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      const recipientName = conv.participant.name;
      setTimeout(() => {
        const replies = [
          `That looks wonderful, thanks for sharing! ✨`,
          `Love this! Let's definitely catch up soon.`,
          `Agreed! Can't wait to see more of this project.`,
          `Amazing work, Alex! 👏`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const botReply = {
          id: `m-reply-${Date.now()}`,
          senderId: conv.participant.id,
          text: randomReply,
          createdAt: 'Just now',
          isRead: true,
        };

        setConversations(cList => cList.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: 'Just now',
              messages: [...c.messages, botReply],
            };
          }
          return c;
        }));
      }, 1800);
    }
  };

  const handleReactMessage = (conversationId: string, messageId: string, emoji: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map(m => {
            if (m.id === messageId) {
              const currentReactions = m.reactions || [];
              const exists = currentReactions.includes(emoji);
              return {
                ...m,
                reactions: exists ? currentReactions.filter(r => r !== emoji) : [...currentReactions, emoji]
              };
            }
            return m;
          })
        };
      }
      return conv;
    }));
  };

  // Reply to story into DM
  const handleReplyToStory = (recipientId: string, replyText: string) => {
    // Find or create conversation
    let conv = conversations.find(c => c.participant.id === recipientId);
    if (conv) {
      handleSendMessage(conv.id, replyText);
    }
  };

  // Story marked as viewed
  const handleStoryViewed = (storyId: string) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return { ...s, hasUnread: false };
      }
      return s;
    }));
  };

  // Send post to user via share modal
  const handleSendPostToUser = (recipientId: string, post: Post) => {
    const conv = conversations.find(c => c.participant.id === recipientId);
    if (conv) {
      handleSendMessage(conv.id, `Shared a post from @${post.author.username}: ${post.caption.slice(0, 40)}...`);
    }
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-[#262626] dark:text-[#f5f5f5] flex flex-col md:flex-row font-sans selection:bg-rose-500/20">
      
      {/* Desktop Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCreateModal={() => setIsCreateModalOpen(true)}
        openNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentUser={currentUser}
      />

      {/* Mobile Top App Bar */}
      <MobileTopBar
        openNotifications={() => setIsNotificationsOpen(true)}
        openMessages={() => setCurrentTab('messages')}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onBrandClick={() => setCurrentTab('home')}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[72px] xl:ml-60 pb-16 md:pb-6 min-h-screen">
        {/* HOME FEED TAB */}
        {currentTab === 'home' && (
          <div className="w-full max-w-6xl mx-auto px-2 md:px-6 pt-4 flex justify-center">
            {/* Feed Column */}
            <div className="w-full max-w-[470px]">
              {/* Stories Carousel */}
              <StoriesTray
                stories={stories}
                currentUser={currentUser}
                onSelectStory={(id) => setSelectedStoryId(id)}
                onAddStory={() => setIsCreateModalOpen(true)}
              />

              {/* Posts Feed */}
              <div className="space-y-4">
                {posts.map((post) => {
                  const authorStory = stories.find(s => s.author.id === post.author.id);
                  return (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onLikeToggle={handleLikeToggle}
                      onSaveToggle={handleSaveToggle}
                      onAddComment={handleAddComment}
                      onCommentLikeToggle={handleCommentLikeToggle}
                      onOpenDetailModal={(p) => setActiveDetailPost(p)}
                      onOpenShareModal={(p) => setActiveSharePost(p)}
                      onSelectUserStory={() => authorStory && setSelectedStoryId(authorStory.id)}
                      hasStory={!!authorStory}
                    />
                  );
                })}
              </div>
            </div>

            {/* Desktop Right Sidebar Suggestions */}
            <RightSidebar
              currentUser={currentUser}
              suggestedUsers={suggestedUsers}
              onToggleFollow={handleToggleFollow}
              onSelectUserProfile={(user) => {
                if (user.id === currentUser.id) {
                  setCurrentTab('profile');
                }
              }}
            />
          </div>
        )}

        {/* EXPLORE / SEARCH TAB */}
        {(currentTab === 'explore' || currentTab === 'search') && (
          <ExploreGrid
            posts={posts}
            onSelectPost={(post) => setActiveDetailPost(post)}
          />
        )}

        {/* REELS TAB */}
        {currentTab === 'reels' && (
          <ReelsViewer
            reels={reels}
            currentUser={currentUser}
            onLikeToggle={handleReelLikeToggle}
            onSaveToggle={handleReelSaveToggle}
            onShareReel={(r) => {
              const dummyPost: Post = {
                id: r.id,
                author: r.author,
                media: [{ url: r.mediaUrl, type: 'video' }],
                caption: r.caption,
                likesCount: r.likesCount,
                isLiked: r.isLiked,
                isSaved: r.isSaved,
                comments: [],
                createdAt: 'Reel',
              };
              setActiveSharePost(dummyPost);
            }}
          />
        )}

        {/* DIRECT MESSAGES TAB */}
        {currentTab === 'messages' && (
          <div className="p-2 md:p-6">
            <DirectMessages
              conversations={conversations}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onReactMessage={handleReactMessage}
            />
          </div>
        )}

        {/* USER PROFILE TAB */}
        {currentTab === 'profile' && (
          <ProfileView
            user={currentUser}
            currentUser={currentUser}
            posts={posts}
            reels={reels}
            onSelectPost={(p) => setActiveDetailPost(p)}
            onUpdateProfile={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Tab Bar */}
      <MobileTabBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCreateModal={() => setIsCreateModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Story Viewer Modal */}
      {selectedStoryId && (
        <StoryViewerModal
          stories={stories}
          initialStoryId={selectedStoryId}
          onClose={() => setSelectedStoryId(null)}
          onReplyToStory={handleReplyToStory}
          onStoryViewed={handleStoryViewed}
        />
      )}

      {/* Post Detail Modal */}
      {activeDetailPost && (
        <PostDetailModal
          post={activeDetailPost}
          currentUser={currentUser}
          onClose={() => setActiveDetailPost(null)}
          onLikeToggle={handleLikeToggle}
          onSaveToggle={handleSaveToggle}
          onAddComment={handleAddComment}
          onCommentLikeToggle={handleCommentLikeToggle}
          onOpenShareModal={(p) => setActiveSharePost(p)}
        />
      )}

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <CreatePostModal
          currentUser={currentUser}
          onClose={() => setIsCreateModalOpen(false)}
          onCreatePost={handleCreatePost}
        />
      )}

      {/* Notification Drawer */}
      <NotificationDrawer
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
      />

      {/* Share Modal */}
      {activeSharePost && (
        <ShareModal
          post={activeSharePost}
          users={suggestedUsers}
          onClose={() => setActiveSharePost(null)}
          onSendToUser={handleSendPostToUser}
        />
      )}
    </div>
  );
}
