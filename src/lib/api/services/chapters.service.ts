import axiosInstance from "@/lib/api/axios.instance";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Chapter, MusicRecommendation } from "@/types";

export const chaptersService = {
  async get(bookId: number, num: number): Promise<Chapter> {
    const { data } = await axiosInstance.get<Chapter>(
      ENDPOINTS.chapters.detail(bookId, num),
    );
    return data;
  },

  async music(chapterId: number): Promise<MusicRecommendation[]> {
    const { data } = await axiosInstance.get<MusicRecommendation[]>(
      ENDPOINTS.music.list(chapterId),
    );
    return data;
  },

  async addBulk(bookId: number, count: number): Promise<Chapter[]> {
    const { data } = await axiosInstance.post<Chapter[]>(
      ENDPOINTS.chapters.addBulk(bookId),
      { number_of_chapters: count },
    );
    return data;
  },
};

export interface AddMusicPayload {
  trackTitle: string;
  artist: string;
  linkType: string;
  linkUrl: string;
  embedCode?: string;
  comment?: string;
  mood?: string;
}

export const musicService = {
  async add(
    chapterId: number,
    payload: AddMusicPayload,
  ): Promise<MusicRecommendation> {
    const { data } = await axiosInstance.post<MusicRecommendation>(
      ENDPOINTS.music.list(chapterId),
      {
        track_title: payload.trackTitle,
        artist: payload.artist,
        link_type: payload.linkType,
        link_url: payload.linkUrl,
        embed_code: payload.embedCode ?? "",
        comment: payload.comment ?? "",
        mood: payload.mood ?? "",
      },
    );
    return data;
  },

  async like(
    id: number,
  ): Promise<{ liked: boolean; likes_count: number }> {
    const { data } = await axiosInstance.post<{
      liked: boolean;
      likes_count: number;
    }>(ENDPOINTS.music.like(id));
    return data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(ENDPOINTS.music.delete(id));
  },
};
