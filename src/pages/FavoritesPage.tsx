import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Song } from '@/types/music';
import SongCard from '@/components/SongCard';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('favorites')
        .select('*, songs(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return (data || []).map((f: any) => ({
        ...f.songs,
        favoriteId: f.id,
      })) as (Song & { favoriteId: string })[];
    },
    enabled: !!user,
  });

  const removeFavorite = async (song: Song & { favoriteId: string }) => {
    await supabase.from('favorites').delete().eq('id', song.favoriteId);
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
    queryClient.invalidateQueries({ queryKey: ['favorite-ids'] });
    toast.success('Removed from favorites');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
          <Heart className="w-6 h-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
          <p className="text-sm text-muted-foreground">{favorites.length} songs</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : favorites.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No favorites yet. Search for songs and like them!</p>
      ) : (
        <div className="space-y-1">
          {favorites.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              queue={favorites}
              isFavorite={true}
              onToggleFavorite={() => removeFavorite(song)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
