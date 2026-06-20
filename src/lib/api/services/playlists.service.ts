import axiosInstance from "@/lib/api/axios.instance";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Playlist } from "@/types";

export const playlistsService = {
  async get(slug: string): Promise<Playlist> {
    const { data } = await axiosInstance.get<Playlist>(
      ENDPOINTS.playlists.detail(slug),
    );
    return data;
  },

  async like(id: number): Promise<{ liked: boolean; likes_count: number }> {
    const { data } = await axiosInstance.post<{
      liked: boolean;
      likes_count: number;
    }>(ENDPOINTS.playlists.like(id));
    return data;
  },

  async create(payload: {
    bookId: number;
    title: string;
    description?: string;
    mood?: string;
    externalLink?: string;
    isPublic?: boolean;
    chapterId?: number;
  }): Promise<Playlist> {
    const { data } = await axiosInstance.post<Playlist>(
      ENDPOINTS.playlists.list,
      {
        book: payload.bookId,
        title: payload.title,
        description: payload.description ?? "",
        mood: payload.mood ?? "",
        external_link: payload.externalLink ?? "",
        is_public: payload.isPublic ?? true,
        chapter: payload.chapterId ?? null,
      },
    );
    return data;
  },
};

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserMe {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified_author: boolean;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthTokens> {
    const { data } = await axiosInstance.post<AuthTokens>(
      ENDPOINTS.auth.login,
      payload,
    );
    return data;
  },

  async me(): Promise<UserMe> {
    const { data } = await axiosInstance.get<UserMe>(ENDPOINTS.auth.me);
    return data;
  },

  async register(payload: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthTokens> {
    const { data } = await axiosInstance.post<AuthTokens>(
      ENDPOINTS.auth.register,
      {
        username: payload.username,
        email: payload.email,
        password: payload.password,
        first_name: payload.firstName ?? "",
        last_name: payload.lastName ?? "",
      },
    );
    return data;
  },
};
