import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Code, Dumbbell, PartyPopper, Coffee, Brain, TrendingUp } from 'lucide-react';

const categories = [
  { id: 'study', label: 'Study', icon: BookOpen, color: 'from-blue-500 to-blue-700', query: 'study music concentration' },
  { id: 'coding', label: 'Coding', icon: Code, color: 'from-green-500 to-green-700', query: 'coding programming music' },
  { id: 'workout', label: 'Workout', icon: Dumbbell, color: 'from-red-500 to-red-700', query: 'workout gym motivation music' },
  { id: 'party', label: 'Party', icon: PartyPopper, color: 'from-purple-500 to-purple-700', query: 'party dance music hits' },
  { id: 'relax', label: 'Relax', icon: Coffee, color: 'from-amber-500 to-amber-700', query: 'relaxing chill ambient music' },
  { id: 'focus', label: 'Focus', icon: Brain, color: 'from-cyan-500 to-cyan-700', query: 'focus deep work instrumental' },
];

const trendingArticles = [
  { slug: 'top-10-chill-songs-2026', title: 'Top 10 Chill Songs 2026', desc: 'The most relaxing tracks to unwind this year.' },
  { slug: 'best-workout-playlists', title: 'Best Workout Playlists', desc: 'Get pumped with these high-energy playlists.' },
  { slug: 'trending-songs-this-week', title: 'Trending Songs This Week', desc: 'What everyone is listening to right now.' },
];

const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Discover</h1>
      <p className="text-muted-foreground mb-8">Explore music by mood, activity, or trending topics.</p>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(({ id, label, icon: Icon, color, query }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
              className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-left text-white`}
            >
              <Icon className="w-8 h-8 mb-3 opacity-90" />
              <p className="text-lg font-bold">{label}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Trending articles */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Trending Articles</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {trendingArticles.map(({ slug, title, desc }) => (
            <button
              key={slug}
              onClick={() => navigate(`/blog/${slug}`)}
              className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/40 transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage;
