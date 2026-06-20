import axiosInstance from "@/lib/api/axios.instance";

export interface Comment {
  id: number;
  text: string;
  user: { id: number; username: string };
  createdAt: string;
  replies: Comment[];
}

export interface AddCommentPayload {
  text: string;
  bookId?: number;
  chapterId?: number;
  playlistId?: number;
  parentId?: number;
}

export const commentsService = {
  async add(payload: AddCommentPayload): Promise<Comment> {
    const { data } = await axiosInstance.post<Comment>("/comments/add/", {
      text: payload.text,
      book_id: payload.bookId,
      chapter_id: payload.chapterId,
      playlist_id: payload.playlistId,
      parent_id: payload.parentId,
    });
    return data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/comments/${id}/delete/`);
  },
};
