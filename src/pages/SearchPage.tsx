import React, { useState, useCallback } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Song } from '@/types/music';
import SongCard from '@/components/SongCard';
import AddToPlaylistModal from '@/components/AddToPlaylistModal';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const SearchPage: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [searching, setSearching] = useState(false);
  const [source, setSource] = useState<'youtube' | 'jamendo'>('youtube');
  const [playlistSong, setPlaylistSong] = useState<Song | null>(null);
  const queryClient = useQueryClient();

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

    // Ensure song exists
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

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Search</h1>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for songs, artists..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={searching}
          className="px-6 py-3 bg-gradient-brand text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Source toggle */}
      <div className="flex rounded-xl bg-secondary p-1 mb-6 max-w-xs">
        <button
          onClick={() => setSource('youtube')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            source === 'youtube' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          YouTube
        </button>
        <button
          onClick={() => setSource('jamendo')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            source === 'jamendo' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          Jamendo
        </button>
      </div>

      {/* Results */}
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
