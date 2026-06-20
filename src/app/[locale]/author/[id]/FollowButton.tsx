"use client";

import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import axiosInstance from "@/lib/api/axios.instance";

interface Props {
  authorId: number;
  initialFollowing: boolean;
}

export function FollowButton({ authorId, initialFollowing }: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    const was = following;
    setFollowing(!was);
    try {
      await axiosInstance.post(`/user/${authorId}/follow/`);
    } catch {
      setFollowing(was);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-medium transition-all"
      style={{
        fontSize: "var(--text-sm)",
        background: following ? "transparent" : "var(--color-accent)",
        color: following ? "var(--color-muted)" : "#fff",
        border: following ? "1px solid var(--color-border)" : "none",
      }}
    >
      {following ? <UserMinus size={13} /> : <UserPlus size={13} />}
      {following ? "Відписатись" : "Підписатись"}
    </button>
  );
}
