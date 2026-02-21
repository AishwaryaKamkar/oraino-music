export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  duration: number | null;
  source: 'youtube' | 'jamendo';
  source_id: string;
  thumbnail: string | null;
  preview_url: string | null;
}

export interface Playlist {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
  songs?: Song[];
}

export interface SearchResult {
  title: string;
  artist: string;
  source: 'youtube' | 'jamendo';
  source_id: string;
  thumbnail: string;
  preview_url: string;
  duration: number;
}
