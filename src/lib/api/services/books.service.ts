import axiosInstance from "@/lib/api/axios.instance";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Book, Chapter, MusicRecommendation, Playlist } from "@/types";

export interface BookListParams {
  search?: string;
  genre?: string;
  sort?: string;
  page?: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const booksService = {
  async list(params?: BookListParams): Promise<PaginatedResponse<Book>> {
    const { data } = await axiosInstance.get<PaginatedResponse<Book>>(
      ENDPOINTS.books.list,
      { params },
    );
    return data;
  },

  async get(slug: string): Promise<Book> {
    const { data } = await axiosInstance.get<Book>(
      ENDPOINTS.books.detail(slug),
    );
    return data;
  },

  async save(id: number): Promise<{ saved: boolean }> {
    const { data } = await axiosInstance.post<{ saved: boolean }>(
      ENDPOINTS.books.save(id),
    );
    return data;
  },

  async rate(id: number, score: number): Promise<void> {
    await axiosInstance.post(ENDPOINTS.books.rate(id), { score });
  },

  async chapters(bookId: number): Promise<Chapter[]> {
    const { data } = await axiosInstance.get<Chapter[]>(
      `${ENDPOINTS.books.detail(bookId)}chapters/`,
    );
    return data;
  },

  async topMusic(bookId: number): Promise<MusicRecommendation[]> {
    const { data } = await axiosInstance.get<MusicRecommendation[]>(
      `${ENDPOINTS.books.detail(bookId)}top-music/`,
    );
    return data;
  },

  async playlists(bookId: number): Promise<Playlist[]> {
    const { data } = await axiosInstance.get<Playlist[]>(
      `${ENDPOINTS.books.detail(bookId)}playlists/`,
    );
    return data;
  },
};
