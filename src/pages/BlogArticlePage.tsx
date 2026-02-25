import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const articles: Record<string, { title: string; category: string; date: string; content: string }> = {
  'top-10-chill-songs-2026': {
    title: 'Top 10 Chill Songs 2026',
    category: 'Relax',
    date: 'Jan 15, 2026',
    content: `Looking for the perfect soundtrack to unwind? 2026 has brought us an incredible selection of chill songs that are perfect for relaxation, meditation, or simply kicking back after a long day.

## 1. Ambient Dreams — Skyline Echo
A mesmerizing blend of ambient synths and gentle piano that transports you to a state of pure calm. This track has been topping chill playlists worldwide.

## 2. Sunset Waves — Ocean Drift
Inspired by the sounds of the ocean, this lo-fi masterpiece features gentle wave samples layered over warm, analog beats. Perfect for a quiet evening.

## 3. Midnight Garden — Luna Sol
Luna Sol delivers a dreamy, atmospheric track with ethereal vocals and soft guitar arpeggios. It's the kind of song that makes time stand still.

## 4. Cloud Nine — Aether
With its floating melodies and minimalist percussion, Cloud Nine is the ultimate stress-relief track. Ideal for yoga or meditation sessions.

## 5. Soft Landing — Velvet Rain
A jazz-influenced chill track featuring a smooth saxophone over lo-fi beats. Velvet Rain proves that relaxation can also be sophisticated.

## 6. Morning Light — Sunrise Collective
Start your day right with this uplifting yet gentle track. Acoustic guitar meets electronic warmth in this beautiful composition.

## 7. Still Waters — Deep Blue
An ambient piece that captures the essence of stillness. Deep Blue uses field recordings and synthesizers to create an immersive soundscape.

## 8. Paper Moon — Indie Wave
A soft indie track with whispered vocals and acoustic instrumentation. Perfect background music for reading or journaling.

## 9. Gravity — Floating Point
Electronic chill at its finest. Floating Point combines glitchy beats with lush pads for a uniquely modern relaxation experience.

## 10. Home — Quiet Storm
The perfect closing track for any chill playlist. Quiet Storm delivers emotional depth through minimalist piano and gentle strings.

---

**How to Listen:** Search for any of these tracks on Oraino Music and add them to your "Chill" playlist. You can also explore our curated Relax category in the Discover section for more recommendations.

*Ready to chill? Open Oraino Music and start streaming these tracks right now. Create your own chill playlist and share it with friends!*`,
  },
  'best-workout-playlists': {
    title: 'Best Workout Playlists for 2026',
    category: 'Workout',
    date: 'Jan 20, 2026',
    content: `Whether you're hitting the gym, going for a run, or doing a home workout, the right music can make all the difference. Here are the best workout playlists and tracks to fuel your 2026 fitness journey.

## High-Intensity Interval Training (HIIT)
For HIIT workouts, you need tracks with BPM between 140-180. Look for EDM bangers, trap beats, and high-energy hip-hop that keeps your adrenaline pumping through every interval.

**Top picks for HIIT:**
- Power Surge — Bass Mechanics
- Overdrive — Neon Pulse
- No Limits — Thunder Drop

## Weightlifting & Strength Training
Heavy beats for heavy lifts. Rock, metal, and aggressive electronic music work best for strength sessions. The key is finding tracks that build intensity gradually.

**Top picks for lifting:**
- Iron Will — Steel Rhythm
- Unbreakable — Granite Sound
- Beast Mode — Raw Energy

## Running & Cardio
For running, match your music to your pace. Start with 120 BPM for warm-up, build to 150+ BPM for sprints, and cool down with 100 BPM tracks.

**Top picks for running:**
- Mile Marker — Stride
- Endless Road — Horizon
- Sprint — Velocity

## Yoga & Stretching
Don't forget the cool-down! Gentle, ambient tracks help your body recover and your mind relax after an intense session.

**Top picks for cool-down:**
- Breath — Zen Garden
- Flow State — Peaceful Mind
- Release — Calm Waters

## How to Build Your Perfect Workout Playlist
1. Start with 2-3 warm-up tracks (moderate energy)
2. Add 8-10 high-energy tracks for the main workout
3. Include 2-3 cool-down tracks at the end
4. Mix genres to keep things fresh
5. Update your playlist weekly with new discoveries

---

*Search "workout" on Oraino Music or visit our Workout category in Discover to find these tracks and more. Share your workout playlist with gym buddies via WhatsApp or Instagram!*`,
  },
  'trending-songs-this-week': {
    title: 'Trending Songs This Week',
    category: 'Trending',
    date: 'Feb 1, 2026',
    content: `Stay in the loop with this week's hottest tracks. From viral hits to underground gems, here's what the Oraino community is loving right now.

## This Week's Top 5

### 1. Neon Nights — Crystal Clear
This electro-pop anthem has taken over social media with its infectious chorus and dazzling synth work. It's the most streamed song on Oraino this week.

### 2. Wildfire — Blaze
A genre-bending track that fuses Afrobeats with pop and R&B. Blaze continues to dominate playlists worldwide.

### 3. Digital Love — Pixel Heart
Retro-inspired synth-pop meets modern production. Digital Love is a nostalgic trip that somehow sounds completely fresh.

### 4. Echoes — Sound Wave
An atmospheric indie track with layered harmonies and dreamy guitar textures. Perfect for late-night listening.

### 5. Rise Up — Phoenix
An empowering anthem with soaring vocals and a massive orchestral arrangement. Phoenix delivers pure emotion.

## Rising Artists to Watch

**Luna Ray** — This lo-fi producer has been gaining massive traction with her dreamy, bedroom-pop influenced beats. Her latest EP "Starlight" is a must-listen.

**Bass Theory** — Blending dubstep with classical music, Bass Theory is creating something entirely new. Their live performances are becoming legendary.

**Aria Bloom** — A singer-songwriter whose raw, honest lyrics have resonated with millions. Her acoustic sessions on Oraino are some of the most saved tracks.

## Genre Spotlight: Afro-Fusion
The biggest genre trend of 2026 continues to be Afro-Fusion — a blend of traditional African rhythms with electronic, pop, and R&B elements. Artists from Lagos to London are leading this movement.

---

*Discover these trending tracks and more on Oraino Music. Don't forget to follow your favorite artists and share your discoveries with friends!*`,
  },
  'best-lofi-beats-for-studying': {
    title: 'Best Lo-Fi Beats for Studying',
    category: 'Study',
    date: 'Feb 10, 2026',
    content: `Lo-fi beats have become the ultimate study companion. The gentle, repetitive nature of lo-fi hip-hop helps maintain focus without being distracting. Here's our guide to the best lo-fi music for studying in 2026.

## Why Lo-Fi Works for Studying
Research shows that music between 60-80 BPM can enhance concentration and memory retention. Lo-fi beats typically fall in this range, making them ideal study companions. The subtle imperfections — vinyl crackle, tape hiss, detuned samples — create a warm, comfortable atmosphere that reduces anxiety.

## Our Top Lo-Fi Recommendations

### For Deep Focus
- Study Session — Chillhop Records
- Late Night Library — Beats by Zen
- Concentration — Lo-Fi Lab

### For Light Reading
- Coffee Shop Vibes — Cozy Beats
- Rainy Day — Window Seat
- Page Turner — Bookworm Beats

### For Exam Prep
- Brain Boost — Neural Beats
- Focus Mode — Study Sound
- Memory Lane — Recall Audio

## Tips for Using Music While Studying
1. **Keep the volume low** — Music should be background, not foreground
2. **Avoid lyrics** — Instrumental tracks prevent cognitive interference
3. **Create a dedicated playlist** — Your brain will associate it with focus mode
4. **Use headphones** — Block external noise for deeper concentration
5. **Take breaks** — Follow the Pomodoro technique: 25 min study, 5 min break

## Build Your Study Playlist on Oraino
Search for "lo-fi study" or visit our Study category in the Discover section. Save your favorite tracks and create a personalized study playlist that you can access anytime.

---

*Ready to boost your productivity? Head to Oraino Music and start building your perfect study playlist today!*`,
  },
  'coding-music-playlist': {
    title: 'The Ultimate Coding Music Playlist',
    category: 'Coding',
    date: 'Feb 15, 2026',
    content: `Every developer knows the power of the right soundtrack. Music can transform a debugging session from frustrating to meditative, and turn a complex feature build into a creative flow state. Here's our guide to the ultimate coding playlist.

## The Science of Coding Music
Studies show that ambient and instrumental music can boost creative problem-solving by up to 15%. The key is finding music that enhances focus without demanding attention. For coding, this means: no lyrics, consistent tempo, and minimal sudden changes.

## Best Genres for Coding

### Ambient Electronic
Perfect for deep work sessions. Artists like Brian Eno pioneered this genre, and modern producers continue to create immersive soundscapes ideal for programming.
- Recommended: Tycho, Boards of Canada, Carbon Based Lifeforms

### Synthwave / Retrowave
The futuristic, 80s-inspired sounds of synthwave pair perfectly with writing code. The steady rhythms and nostalgic melodies keep energy high without being distracting.
- Recommended: Com Truise, Kavinsky, FM-84

### Post-Rock
Building crescendos and epic soundscapes make post-rock ideal for tackling complex problems. The genre's emotional depth can fuel creative coding sessions.
- Recommended: Explosions in the Sky, Mogwai, God Is an Astronaut

### Video Game Soundtracks
Designed to maintain focus during gameplay, video game OSTs are secretly the best coding music. They're composed to keep you engaged without pulling attention.
- Recommended: Minecraft OST, Stardew Valley OST, Celeste OST

## Flow State Tips for Developers
1. **Start with familiar tracks** — New music can be distracting initially
2. **Use noise-canceling headphones** — Essential in open offices
3. **Match energy to task** — Ambient for architecture, upbeat for implementation
4. **Create context-specific playlists** — "Debugging", "Feature Building", "Code Review"
5. **Use the Pomodoro method** — Code for 25 min, break for 5, repeat

---

*Find all these genres and more on Oraino Music. Head to the Coding category in Discover to get started. Happy coding! 🎵💻*`,
  },
};

const BlogArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = React.useState(false);
  const article = slug ? articles[slug] : null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'whatsapp' | 'facebook') => {
    const text = `Check out "${article?.title}" on Oraino Music!`;
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };
    window.open(urls[platform], '_blank');
  };

  if (!article) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
        <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link to="/blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">{article.category}</span>
        <span className="text-xs text-muted-foreground">{article.date}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{article.title}</h1>

      {/* Share buttons */}
      <div className="flex items-center gap-2 mb-8 pb-6 border-b border-border">
        <span className="text-sm text-muted-foreground mr-2">Share:</span>
        <button onClick={() => handleShare('whatsapp')} className="px-3 py-1.5 text-xs rounded-lg bg-green-600 text-white hover:opacity-90 transition-opacity">WhatsApp</button>
        <button onClick={() => handleShare('facebook')} className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:opacity-90 transition-opacity">Facebook</button>
        <button onClick={handleCopyLink} className="px-3 py-1.5 text-xs rounded-lg bg-secondary text-foreground hover:opacity-90 transition-opacity flex items-center gap-1">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied' : 'Copy Link'}
        </button>
      </div>

      {/* Article content rendered as markdown-like */}
      <div className="prose prose-invert max-w-none">
        {article.content.split('\n').map((line, i) => {
          if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-foreground mt-6 mb-2">{line.slice(4)}</h3>;
          if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{line.slice(3)}</h2>;
          if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-foreground mt-4">{line.slice(2, -2)}</p>;
          if (line.startsWith('- ')) return <li key={i} className="text-muted-foreground ml-4 list-disc">{line.slice(2)}</li>;
          if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-primary italic mt-4">{line.slice(1, -1)}</p>;
          if (line === '---') return <hr key={i} className="border-border my-6" />;
          if (line.trim() === '') return <br key={i} />;
          return <p key={i} className="text-secondary-foreground leading-relaxed mb-2">{line}</p>;
        })}
      </div>
    </div>
  );
};

export default BlogArticlePage;
