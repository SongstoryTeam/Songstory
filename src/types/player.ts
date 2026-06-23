export type LinkType = "youtube" | "spotify" | "soundcloud" | "other";

export interface PlayerTrack {
    id: number;
    title: string;
    artist: string;
    linkType: LinkType;
    embedCode?: string | null;
    linkUrl: string;
}