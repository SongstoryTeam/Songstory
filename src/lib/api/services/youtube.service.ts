import axiosInstance from "@/lib/api/axios.instance";

export interface YouTubeResult {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

export const youtubeService = {
  async search(query: string): Promise<YouTubeResult[]> {
    if (query.trim().length < 3) return [];
    const { data } = await axiosInstance.get<{ results: YouTubeResult[] }>(
      "/youtube-search/",
      { params: { q: query } },
    );
    return data.results ?? [];
  },
};
