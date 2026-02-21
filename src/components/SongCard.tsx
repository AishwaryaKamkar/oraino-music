import React from 'react';
import type { Song } from '@/types/music';
import { usePlayer } from '@/context/PlayerContext';
import { Play, Pause, Heart, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SongCardProps {
  song: Song;
  queue?: Song[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAddToPlaylist?: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, queue, isFavorite, onToggleFavorite, onAddToPlaylist }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const isCurrentSong = currentSong?.source_id === song.source_id;

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song, queue);
    }
  };

  return (
    <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-all cursor-pointer">
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={song.thumbnail || '/placeholder.svg'}
          alt={song.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handlePlay}
          className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isCurrentSong && isPlaying ? (
            <Pause className="w-5 h-5 text-primary" />
          ) : (
            <Play className="w-5 h-5 text-primary ml-0.5" />
          )}
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium truncate ${isCurrentSong ? 'text-primary' : 'text-foreground'}`}>
          {song.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {song.artist}
          {song.source === 'youtube' && ' • YouTube'}
          {song.source === 'jamendo' && ' • Jamendo'}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleFavorite && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`p-2 rounded-lg transition-colors ${isFavorite ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
        {onAddToPlaylist && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddToPlaylist(); }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SongCard;
