import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Song } from '@/types/music';
import SongCard from '@/components/SongCard';
import { Library, Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { usePlayer } from '@/context/PlayerContext';

const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ['playlists', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: playlistSongs = [] } = useQuery({
    queryKey: ['playlist-songs', selectedPlaylist],
    queryFn: async () => {
      if (!selectedPlaylist) return [];
      const { data } = await supabase
        .from('playlist_songs')
        .select('*, songs(*)')
        .eq('playlist_id', selectedPlaylist)
        .order('position');
      return (data || []).map((ps: any) => ({ ...ps.songs, playlistSongId: ps.id })) as (Song & { playlistSongId: string })[];
    },
    enabled: !!selectedPlaylist,
  });

  const createPlaylist = async () => {
    if (!user || !newTitle.trim()) return;
    await supabase.from('playlists').insert({ user_id: user.id, title: newTitle.trim() });
    setNewTitle('');
    setShowCreate(false);
    queryClient.invalidateQueries({ queryKey: ['playlists'] });
    toast.success('Playlist created');
  };

  const deletePlaylist = async (id: string) => {
    await supabase.from('playlists').delete().eq('id', id);
    if (selectedPlaylist === id) setSelectedPlaylist(null);
    queryClient.invalidateQueries({ queryKey: ['playlists'] });
    toast.success('Playlist deleted');
  };

  const removeSong = async (playlistSongId: string) => {
    await supabase.from('playlist_songs').delete().eq('id', playlistSongId);
    queryClient.invalidateQueries({ queryKey: ['playlist-songs'] });
    toast.success('Song removed');
  };

  const selected = playlists.find(p => p.id === selectedPlaylist);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {selectedPlaylist && selected ? (
        <>
          <button
            onClick={() => setSelectedPlaylist(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Library
          </button>
          <h1 className="text-2xl font-bold text-foreground mb-1">{selected.title}</h1>
          <p className="text-sm text-muted-foreground mb-6">{playlistSongs.length} songs</p>
          <div className="space-y-1">
            {playlistSongs.map(song => (
              <div key={song.playlistSongId} className="flex items-center">
                <div className="flex-1">
                  <SongCard song={song} queue={playlistSongs} />
                </div>
                <button
                  onClick={() => removeSong(song.playlistSongId)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {playlistSongs.length === 0 && (
              <p className="text-center text-muted-foreground py-12">Empty playlist. Search for songs to add!</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center">
                <Library className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Your Library</h1>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="p-2 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {showCreate && (
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Playlist name"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createPlaylist()}
                className="flex-1 px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none text-sm"
                autoFocus
              />
              <button
                onClick={createPlaylist}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
              >
                Create
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : playlists.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No playlists yet. Create your first one!</p>
          ) : (
            <div className="grid gap-3">
              {playlists.map(pl => (
                <div
                  key={pl.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => setSelectedPlaylist(pl.id)}
                >
                  <div>
                    <p className="font-medium text-foreground">{pl.title}</p>
                    <p className="text-xs text-muted-foreground">{pl.description || 'Playlist'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); deletePlaylist(pl.id); }}
                      className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LibraryPage;
