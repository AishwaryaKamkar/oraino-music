import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

const articles = [
  {
    slug: 'top-10-chill-songs-2026',
    title: 'Top 10 Chill Songs 2026',
    excerpt: 'Discover the most relaxing and soothing tracks of 2026. Perfect for unwinding after a long day.',
    date: 'Jan 15, 2026',
    category: 'Relax',
  },
  {
    slug: 'best-workout-playlists',
    title: 'Best Workout Playlists for 2026',
    excerpt: 'Get motivated with high-energy playlists curated for every type of workout session.',
    date: 'Jan 20, 2026',
    category: 'Workout',
  },
  {
    slug: 'trending-songs-this-week',
    title: 'Trending Songs This Week',
    excerpt: 'Stay up to date with the hottest tracks everyone is listening to right now.',
    date: 'Feb 1, 2026',
    category: 'Trending',
  },
  {
    slug: 'best-lofi-beats-for-studying',
    title: 'Best Lo-Fi Beats for Studying',
    excerpt: 'Boost your focus and productivity with the ultimate lo-fi study playlist.',
    date: 'Feb 10, 2026',
    category: 'Study',
  },
  {
    slug: 'coding-music-playlist',
    title: 'The Ultimate Coding Music Playlist',
    excerpt: 'Instrumental tracks and ambient sounds to help you get into the flow state while coding.',
    date: 'Feb 15, 2026',
    category: 'Coding',
  },
];

const BlogPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">Music guides, playlists, and trending picks curated by the Oraino team.</p>

      <div className="grid gap-6">
        {articles.map(({ slug, title, excerpt, date, category }) => (
          <Link
            key={slug}
            to={`/blog/${slug}`}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">{category}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" /> {date}
              </span>
            </div>
            <h2 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{title}</h2>
            <p className="text-sm text-muted-foreground mb-3">{excerpt}</p>
            <span className="flex items-center gap-1 text-sm text-primary font-medium">
              Read more <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
