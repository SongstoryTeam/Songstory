export type LinkType = "youtube" | "spotify" | "soundcloud" | "other";

export type MoodKey =
  | "epic"
  | "sad"
  | "calm"
  | "tense"
  | "romantic"
  | "dark"
  | "uplifting"
  | "mysterious";

export interface Book {
  id: number;
  slug: string;
  title: string;
  author: string;
  genre: string | null;
  year: number;
  coverUrl: string | null;
  viewsCount: number;
  averageRating: number;
  ratingsCount: number;
  chaptersCount: number;
}

export interface Chapter {
  id: number;
  number: number;
  title: string;
  description: string;
  moodTags: string;
  isApproved: boolean;
  musicCount: number;
}

export interface MusicRecommendation {
  id: number;
  trackTitle: string;
  artist: string;
  linkType: LinkType;
  linkUrl: string;
  embedCode: string;
  comment: string;
  mood: MoodKey | "";
  likesCount: number;
  createdAt: string;
  user: { id: number; username: string };
}

export interface Playlist {
  id: number;
  slug: string;
  title: string;
  description: string;
  mood: string;
  externalLink: string;
  likesCount: number;
  isPublic: boolean;
  createdAt: string;
  creator: { id: number; username: string };
}

export interface PlayerTrack {
  id: number;
  title: string;
  artist: string;
  linkType: LinkType;
  embedCode: string;
  linkUrl: string;
}
