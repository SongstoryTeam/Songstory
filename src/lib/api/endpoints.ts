export const ENDPOINTS = {
  auth: {
    login: "/auth/token/",
    refresh: "/auth/token/refresh/",
    register: "/auth/register/",
    me: "/auth/me/",
  },
  books: {
    list: "/books/",
    detail: (id: number | string) => `/books/${id}/`,
    save: (id: number) => `/books/${id}/save/`,
    rate: (id: number) => `/books/${id}/rate/`,
  },
  chapters: {
    detail: (bookId: number, num: number) => `/books/${bookId}/chapters/${num}/`,
    addBulk: (bookId: number) => `/books/${bookId}/chapters/bulk/`,
  },
  music: {
    list: (chapterId: number) => `/chapters/${chapterId}/music/`,
    like: (id: number) => `/music/${id}/like/`,
    delete: (id: number) => `/music/${id}/`,
  },
  playlists: {
    list: "/playlists/",
    detail: (id: number | string) => `/playlists/${id}/`,
    like: (id: number) => `/playlists/${id}/like/`,
    tracks: (id: number) => `/playlists/${id}/tracks/`,
  },
  notifications: {
    list: "/notifications/",
    markRead: (id: number) => `/notifications/${id}/read/`,
    markAllRead: "/notifications/read-all/",
  },
} as const;
