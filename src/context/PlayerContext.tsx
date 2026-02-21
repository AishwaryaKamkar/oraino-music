import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import type { Song } from '@/types/music';
import { supabase } from '@/integrations/supabase/client';

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  repeatMode: 'off' | 'one' | 'all';
  sleepTimer: number | null;
}

interface PlayerContextType extends PlayerState {
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setSleepTimer: (minutes: number | null) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    queue: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isShuffle: false,
    repeatMode: 'off',
    sleepTimer: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Track recently played
  const trackPlay = useCallback(async (song: Song) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Upsert song into songs table
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

    // Get song ID
    const { data: songData } = await supabase
      .from('songs')
      .select('id')
      .eq('source', song.source)
      .eq('source_id', song.source_id)
      .single();

    if (songData) {
      await supabase.from('recently_played').insert({
        user_id: user.id,
        song_id: songData.id,
      });
    }
  }, []);

  const playSong = useCallback((song: Song, queue?: Song[]) => {
    // Stop any existing YouTube playback
    if (youtubeIframeRef.current) {
      youtubeIframeRef.current.src = '';
    }

    setState(prev => ({
      ...prev,
      currentSong: song,
      queue: queue || prev.queue,
      isPlaying: true,
      currentTime: 0,
    }));

    if (song.source === 'jamendo' && song.preview_url && audioRef.current) {
      audioRef.current.src = song.preview_url;
      audioRef.current.play().catch(() => {});
    }

    trackPlay(song);
  }, [trackPlay]);

  const togglePlay = useCallback(() => {
    setState(prev => {
      if (prev.currentSong?.source === 'jamendo' && audioRef.current) {
        if (prev.isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(() => {});
        }
      }
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  const getNextIndex = useCallback(() => {
    const { queue, currentSong, isShuffle } = state;
    if (!currentSong || queue.length === 0) return -1;
    const idx = queue.findIndex(s => s.source_id === currentSong.source_id);
    if (isShuffle) {
      return Math.floor(Math.random() * queue.length);
    }
    return (idx + 1) % queue.length;
  }, [state]);

  const nextTrack = useCallback(() => {
    const { queue, repeatMode, currentSong } = state;
    if (repeatMode === 'one' && currentSong) {
      playSong(currentSong, queue);
      return;
    }
    const nextIdx = getNextIndex();
    if (nextIdx >= 0 && queue[nextIdx]) {
      playSong(queue[nextIdx], queue);
    }
  }, [state, getNextIndex, playSong]);

  const prevTrack = useCallback(() => {
    const { queue, currentSong } = state;
    if (!currentSong || queue.length === 0) return;
    const idx = queue.findIndex(s => s.source_id === currentSong.source_id);
    const prevIdx = idx <= 0 ? queue.length - 1 : idx - 1;
    if (queue[prevIdx]) {
      playSong(queue[prevIdx], queue);
    }
  }, [state, playSong]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setState(prev => ({ ...prev, volume: vol }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({
      ...prev,
      isShuffle: !prev.isShuffle,
      queue: !prev.isShuffle ? shuffleArray(prev.queue) : prev.queue,
    }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => ({
      ...prev,
      repeatMode: prev.repeatMode === 'off' ? 'all' : prev.repeatMode === 'all' ? 'one' : 'off',
    }));
  }, []);

  const setSleepTimer = useCallback((minutes: number | null) => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    if (minutes) {
      sleepTimerRef.current = setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false, sleepTimer: null }));
      }, minutes * 60 * 1000);
    }

    setState(prev => ({ ...prev, sleepTimer: minutes }));
  }, []);

  // Audio time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime, duration: audio.duration || 0 }));
    };
    const onEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [nextTrack]);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        playSong,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        setSleepTimer,
        audioRef,
      }}
    >
      <audio ref={audioRef} preload="auto" />
      {children}
    </PlayerContext.Provider>
  );
};
