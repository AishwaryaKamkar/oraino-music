import React, { useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, ChevronDown, Music, Heart, ListMusic,
  ThumbsUp,
} from 'lucide-react';

const formatTime = (s: number) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const FullScreenPlayer: React.FC<Props> = ({ open, onClose }) => {
  const {
    currentSong, isPlaying, currentTime, duration, volume,
    isShuffle, repeatMode, queue,
    togglePlay, nextTrack, prevTrack, seek, setVolume,
    toggleShuffle, toggleRepeat,
  } = usePlayer();

  const progressRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(pct * duration);
  };

  if (!currentSong) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const isYoutube = currentSong.source === 'youtube';

  // Find next track in queue
  const currentIdx = queue.findIndex(s => s.source_id === currentSong.source_id);
  const nextSong = currentIdx >= 0 && currentIdx < queue.length - 1 ? queue[currentIdx + 1] : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[70] bg-background flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className="w-6 h-6" />
            </button>
            <p className="text-xs text-primary uppercase tracking-[0.2em] font-semibold">Now Playing</p>
            <div className="w-10" />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5 min-h-0 overflow-y-auto">
            {/* Song title & artist above art */}
            <div className="text-center w-full max-w-[320px]">
              <p className="text-xl font-bold text-primary truncate">{currentSong.title}</p>
              <p className="text-sm text-muted-foreground truncate mt-1">by {currentSong.artist}</p>
            </div>

            {/* Album Art - static, no rotation */}
            <div className="relative w-full max-w-[280px] aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 blur-3xl opacity-20 scale-150"
                style={{
                  backgroundImage: `url(${currentSong.thumbnail || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {currentSong.thumbnail ? (
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="relative w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full bg-card border border-border flex items-center justify-center">
                  <Music className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Progress bar */}
            {!isYoutube && (
              <div className="w-full max-w-[320px] space-y-1">
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="w-full h-1.5 bg-secondary rounded-full cursor-pointer group relative"
                >
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative transition-all"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-primary font-mono">{formatTime(currentTime)}</span>
                  <span className="text-xs text-muted-foreground font-mono">{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-5 w-full max-w-[320px]">
              <button
                onClick={toggleShuffle}
                className={`p-2 transition-colors ${isShuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <ThumbsUp className="w-5 h-5" />
              </button>

              <button onClick={prevTrack} className="p-2 text-foreground hover:text-primary transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <button onClick={nextTrack} className="p-2 text-foreground hover:text-primary transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2 transition-colors ${repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </button>
            </div>

            {/* Up Next & Playlist info */}
            <div className="w-full max-w-[320px] flex gap-3 mt-2">
              {nextSong && (
                <div className="flex-1 bg-card/50 border border-border rounded-xl p-3">
                  <p className="text-[10px] text-primary uppercase tracking-wider mb-1">Up Next</p>
                  <p className="text-sm font-medium text-foreground truncate">{nextSong.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{nextSong.artist}</p>
                </div>
              )}
              {queue.length > 0 && (
                <div className="flex-1 bg-card/50 border border-border rounded-xl p-3">
                  <p className="text-[10px] text-primary uppercase tracking-wider mb-1">Playlist</p>
                  <p className="text-sm font-medium text-foreground truncate">{currentSong.album || 'Queue'}</p>
                  <p className="text-xs text-muted-foreground">{queue.length} Songs</p>
                </div>
              )}
            </div>

            {/* Volume */}
            <div className="flex items-center justify-center gap-3 w-full max-w-[320px]">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-32 accent-primary"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenPlayer;
