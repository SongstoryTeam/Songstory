"use client";

import { create } from "zustand";
import type { PlayerTrack } from "@/types";

interface PlayerState {
  current: PlayerTrack | null;
  visible: boolean;
  load: (track: PlayerTrack) => void;
  toggle: () => void;
  close: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  current: null,
  visible: false,

  load: (track) => {
    const { current } = get();
    if (current?.id === track.id) {
      set((s) => ({ visible: !s.visible }));
      return;
    }
    set({ current: track, visible: true });
  },

  toggle: () => set((s) => ({ visible: !s.visible })),

  close: () => set({ visible: false, current: null }),
}));
