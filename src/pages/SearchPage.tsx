import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Song } from '@/types/music';
import SongCard from '@/components/SongCard';
import AddToPlaylistModal from '@/components/AddToPlaylistModal';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const SearchPage: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [searching, setSearching] = useState(false);
  const source = 'youtube'; // default source, toggle removed
  const [playlistSong, setPlaylistSong] = useState<Song | null>(null);
  const queryClient = useQueryClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorite-ids', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('favorites')
        .select('song_id, songs(source, source_id)')
        .eq('user_id', user.id);
      return (data || []).map((f: any) => f.songs?.source_id).filter(Boolean);
    },
    enabled: !!user,
  });

  const { data: recentlyPlayed = [] } = useQuery({
    queryKey: ['recently-played-search', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('recently_played')
        .select('*, songs(*)')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(10);
      return (data || []).map((r: any) => ({
        title: r.songs.title,
        artist: r.songs.artist,
        album: r.songs.album,
        duration: r.songs.duration,
        source: r.songs.source,
        source_id: r.songs.source_id,
        thumbnail: r.songs.thumbnail,
        preview_url: r.songs.preview_url,
      })) as Song[];
    },
    enabled: !!user,
  });

  // Live search with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      handleSearch();
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, source]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-music', {
        body: { query: query.trim(), source },
      });
      if (error) throw error;
      setResults(data?.results || []);
    } catch (err) {
      toast.error('Search failed. Make sure API keys are configured.');
      setResults([]);
    }
    setSearching(false);
  };

  const toggleFavorite = async (song: Song) => {
    if (!user) return;
    await supabase.from('songs').upsert({
      title: song.title, artist: song.artist, album: song.album || '',
      duration: song.duration || 0, source: song.source, source_id: song.source_id,
      thumbnail: song.thumbnail || '', preview_url: song.preview_url || '',
    }, { onConflict: 'source,source_id' });

    const { data: songData } = await supabase
      .from('songs').select('id').eq('source', song.source).eq('source_id', song.source_id).single();
    if (!songData) return;

    const isFav = favorites.includes(song.source_id);
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('song_id', songData.id);
      toast.success('Removed from favorites');
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, song_id: songData.id });
      toast.success('Added to favorites');
    }
    queryClient.invalidateQueries({ queryKey: ['favorite-ids'] });
  };

  const showRecent = !query.trim() && recentlyPlayed.length > 0;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Search</h1>

      {/* Search input */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Start typing to search songs, artists..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {searching && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>


      {/* Recently played section */}
      {showRecent && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-accent inline-block" />
            Recently Played
          </h2>
          <div className="space-y-1">
            {recentlyPlayed.map((song, i) => (
              <SongCard
                key={`recent-${song.source_id}-${i}`}
                song={song}
                queue={recentlyPlayed}
                isFavorite={favorites.includes(song.source_id)}
                onToggleFavorite={() => toggleFavorite(song)}
                onAddToPlaylist={() => setPlaylistSong(song)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search results */}
      <div className="space-y-1">
        {results.map((song, i) => (
          <SongCard
            key={`${song.source_id}-${i}`}
            song={song}
            queue={results}
            isFavorite={favorites.includes(song.source_id)}
            onToggleFavorite={() => toggleFavorite(song)}
            onAddToPlaylist={() => setPlaylistSong(song)}
          />
        ))}
        {!searching && results.length === 0 && query && (
          <p className="text-center text-muted-foreground py-12">No results found. Try a different search.</p>
        )}
      </div>

      {playlistSong && (
        <AddToPlaylistModal song={playlistSong} onClose={() => setPlaylistSong(null)} />
      )}
    </div>
  );
};

export default SearchPage;
