import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Search, Music, Heart, Library } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Song } from '@/types/music';
import SongCard from '@/components/SongCard';

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: recentSongs = [] } = useQuery({
    queryKey: ['recent-home', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('recently_played')
        .select('*, songs(*)')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(6);
      return (data || []).map((rp: any) => rp.songs).filter(Boolean) as Song[];
    },
    enabled: !!user,
  });

  const { data: playlists = [] } = useQuery({
    queryKey: ['playlists-home', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);
      return data || [];
    },
    enabled: !!user,
  });

  const quickLinks = [
    { icon: Search, label: 'Search Music', path: '/search', gradient: 'bg-gradient-brand' },
    { icon: Heart, label: 'Favorites', path: '/favorites', gradient: 'bg-gradient-accent' },
    { icon: Library, label: 'Your Library', path: '/library', gradient: 'bg-secondary' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
        </h1>
        <p className="text-muted-foreground">What do you want to listen to?</p>
      </motion.div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {quickLinks.map(({ icon: Icon, label, path, gradient }) => (
          <motion.button
            key={path}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(path)}
            className={`flex items-center gap-4 p-4 rounded-xl ${gradient} transition-all`}
          >
            <Icon className="w-6 h-6 text-primary-foreground" />
            <span className="font-medium text-primary-foreground">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Recent playlists */}
      {playlists.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Your Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {playlists.map(pl => (
              <button
                key={pl.id}
                onClick={() => navigate('/library')}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 text-left transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center mb-3">
                  <Music className="w-5 h-5 text-primary-foreground" />
                </div>
                <p className="font-medium text-foreground text-sm truncate">{pl.title}</p>
                <p className="text-xs text-muted-foreground">Playlist</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Recently played */}
      {recentSongs.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Recently Played</h2>
          <div className="space-y-1">
            {recentSongs.map((song, i) => (
              <SongCard key={`${song.id}-${i}`} song={song} queue={recentSongs} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {recentSongs.length === 0 && playlists.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-brand mx-auto mb-6 flex items-center justify-center">
            <Music className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Welcome to Oraino</h2>
          <p className="text-muted-foreground mb-6">Start by searching for your favorite music</p>
          <button
            onClick={() => navigate('/search')}
            className="px-8 py-3 bg-gradient-brand text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Start Searching
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
