import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Song } from '@/types/music';
import { toast } from 'sonner';
import { X, Plus, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface AddToPlaylistModalProps {
  song: Song;
  onClose: () => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ song, onClose }) => {
  const { user } = useAuth();
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const { data: playlists, refetch } = useQuery({
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

  const addToPlaylist = async (playlistId: string) => {
    // Ensure song exists in songs table
    await supabase.from('songs').upsert({
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      duration: song.duration || 0,
      source: song.source,
      source_id: song.source_id,
      thumbnail: song.thumbnail || '',
      preview_url: song.preview_url || '',
    }, { onConflict: 'source,source_id' });

    const { data: songData } = await supabase
      .from('songs')
      .select('id')
      .eq('source', song.source)
      .eq('source_id', song.source_id)
      .single();

    if (!songData) {
      toast.error('Failed to find song');
      return;
    }

    const { error } = await supabase.from('playlist_songs').insert({
      playlist_id: playlistId,
      song_id: songData.id,
    });

    if (error) {
      if (error.code === '23505') toast.info('Song already in playlist');
      else toast.error('Failed to add song');
    } else {
      toast.success('Added to playlist');
    }
    onClose();
  };

  const createPlaylist = async () => {
    if (!user || !newTitle.trim()) return;
    setCreating(true);
    const { data, error } = await supabase.from('playlists').insert({
      user_id: user.id,
      title: newTitle.trim(),
    }).select().single();

    if (data && !error) {
      await addToPlaylist(data.id);
      refetch();
    }
    setCreating(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Add to Playlist</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="New playlist name..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="flex-1 px-3 py-2 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none text-sm"
          />
          <button
            onClick={createPlaylist}
            disabled={creating || !newTitle.trim()}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1 max-h-60 overflow-y-auto">
          {playlists?.map(pl => (
            <button
              key={pl.id}
              onClick={() => addToPlaylist(pl.id)}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-sm text-foreground"
            >
              {pl.title}
            </button>
          ))}
          {!playlists?.length && (
            <p className="text-center text-sm text-muted-foreground py-4">No playlists yet. Create one above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
