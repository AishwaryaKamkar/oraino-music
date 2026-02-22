import React, { useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, ChevronDown, Music, Timer,
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
    isShuffle, repeatMode,
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[70] bg-background flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className="w-6 h-6" />
            </button>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Now Playing</p>
            <div className="w-10" />
          </div>

          {/* Album Art */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 min-h-0">
            <div className="relative w-full max-w-[300px] aspect-square">
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
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
                  className={`relative w-full h-full rounded-3xl object-cover shadow-2xl ${isPlaying ? 'animate-spin-slow' : ''}`}
                  style={isPlaying ? { animationDuration: '20s' } : {}}
                />
              ) : (
                <div className="relative w-full h-full rounded-3xl bg-card border border-border flex items-center justify-center shadow-2xl">
                  <Music className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Song info */}
            <div className="text-center w-full max-w-[300px]">
              <p className="text-lg font-bold text-foreground truncate">{currentSong.title}</p>
              <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
              {currentSong.album && (
                <p className="text-xs text-muted-foreground/60 truncate mt-1">{currentSong.album}</p>
              )}
            </div>
          </div>

          {/* Controls section */}
          <div className="shrink-0 px-8 pb-10 space-y-4">
            {/* Progress */}
            {!isYoutube && (
              <div className="space-y-1">
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="w-full h-2 bg-secondary rounded-full cursor-pointer group"
                >
                  <div
                    className="h-full bg-primary rounded-full relative transition-all"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground font-mono">{formatTime(currentTime)}</span>
                  <span className="text-xs text-muted-foreground font-mono">{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Main controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-lg transition-colors ${
                  isShuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button onClick={prevTrack} className="p-2 text-foreground hover:text-primary transition-colors">
                <SkipBack className="w-7 h-7" />
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg"
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </button>

              <button onClick={nextTrack} className="p-2 text-foreground hover:text-primary transition-colors">
                <SkipForward className="w-7 h-7" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-lg transition-colors ${
                  repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-center gap-3">
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

            {/* Lyrics placeholder */}
            <div className="rounded-xl bg-card border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Lyrics</p>
              <p className="text-sm text-muted-foreground/60 italic">Lyrics coming soon...</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenPlayer;
