import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Song } from '@/types/music';
import SongCard from '@/components/SongCard';
import { Clock } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const { user } = useAuth();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('recently_played')
        .select('*, songs(*)')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(50);
      return (data || []).map((rp: any) => rp.songs).filter(Boolean) as Song[];
    },
    enabled: !!user,
  });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
          <Clock className="w-6 h-6 text-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recently Played</h1>
          <p className="text-sm text-muted-foreground">{history.length} songs</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No listening history yet.</p>
      ) : (
        <div className="space-y-1">
          {history.map((song, i) => (
            <SongCard key={`${song.id}-${i}`} song={song} queue={history} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
