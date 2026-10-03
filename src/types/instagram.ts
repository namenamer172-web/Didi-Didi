export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified?: boolean;
  isFollowing?: boolean;
  isOnline?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface PostMedia {
  url: string;
  type: 'image' | 'video';
  filter?: string;
  aspectRatio?: '1:1' | '4:5' | '16:9';
  brightness?: number;
  contrast?: number;
  saturate?: number;
}

export interface Post {
  id: string;
  author: User;
  media: PostMedia[];
  caption: string;
  location?: string;
  tags?: string[];
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: Comment[];
  createdAt: string;
  audioTrack?: {
    title: string;
    artist: string;
  };
}

export interface StorySlide {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
  caption?: string;
  createdAt: string;
  filter?: string;
}

export interface Story {
  id: string;
  author: User;
  slides: StorySlide[];
  hasUnread: boolean;
}

export interface Reel {
  id: string;
  author: User;
  mediaUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  audioTitle: string;
  audioArtist: string;
  filter?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  audioSeconds?: number;
  createdAt: string;
  isRead?: boolean;
  reactions?: string[];
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: DirectMessage[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  actor: User;
  postPreviewUrl?: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface FilterPreset {
  name: string;
  label: string;
  filterValue: string;
  previewClass?: string;
}
