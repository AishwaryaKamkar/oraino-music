import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

async function searchYouTube(query: string) {
  const apiKey = Deno.env.get('YOUTUBE_API_KEY');
  if (!apiKey) throw new Error('YouTube API key not configured');

  const cacheKey = `yt:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=20&q=${encodeURIComponent(query)}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`YouTube API error: ${err}`);
  }

  const data = await res.json();
  const results = (data.items || []).map((item: any) => ({
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    source: 'youtube',
    source_id: item.id.videoId,
    thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
    preview_url: '',
    duration: 0,
    album: '',
  }));

  cache.set(cacheKey, { data: results, timestamp: Date.now() });
  return results;
}

async function searchJamendo(query: string) {
  const clientId = Deno.env.get('JAMENDO_CLIENT_ID');
  if (!clientId) throw new Error('Jamendo Client ID not configured');

  const cacheKey = `jm:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=20&search=${encodeURIComponent(query)}&include=musicinfo`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Jamendo API error: ${err}`);
  }

  const data = await res.json();
  const results = (data.results || []).map((track: any) => ({
    title: track.name,
    artist: track.artist_name,
    source: 'jamendo',
    source_id: String(track.id),
    thumbnail: track.image || '',
    preview_url: track.audio || '',
    duration: Number(track.duration) || 0,
    album: track.album_name || '',
  }));

  cache.set(cacheKey, { data: results, timestamp: Date.now() });
  return results;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, source } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let results;
    if (source === 'jamendo') {
      results = await searchJamendo(query);
    } else {
      results = await searchYouTube(query);
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
