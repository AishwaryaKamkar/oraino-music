import React, { useRef, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { X as CloseIcon } from 'lucide-react';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, Timer, ChevronUp,
} from 'lucide-react';
import FullScreenPlayer from './FullScreenPlayer';

const formatTime = (s: number) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const PlayerBar: React.FC = () => {
  const {
    currentSong, isPlaying, currentTime, duration, volume,
    isShuffle, repeatMode, sleepTimer, showAd,
    togglePlay, nextTrack, prevTrack, seek, setVolume,
    toggleShuffle, toggleRepeat, setSleepTimer, dismissAd,
  } = usePlayer();

  const [expanded, setExpanded] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
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
    <>
      {/* Ad overlay */}
      {showAd && (
        <div className="fixed inset-0 z-[60] bg-background/90 flex items-center justify-center">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 text-center relative">
            <button
              onClick={() => { dismissAd(); togglePlay(); }}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">Advertisement</p>
            <div className="w-full h-40 rounded-xl bg-secondary border border-border flex items-center justify-center mb-4">
              <span className="text-muted-foreground text-sm">Your Ad Here</span>
            </div>
            <button
              onClick={() => { dismissAd(); togglePlay(); }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Continue Listening
            </button>
          </div>
        </div>
      )}

    <div className="fixed bottom-0 left-0 right-0 z-50 bg-player border-t border-border">
      {/* YouTube iframe (hidden, for audio playback) */}
      {isYoutube && isPlaying && (
        <iframe
          className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none"
          src={`https://www.youtube.com/embed/${currentSong.source_id}?autoplay=1&enablejsapi=1`}
          allow="autoplay"
          title="YouTube player"
        />
      )}

      {/* Progress bar */}
      {!isYoutube && (
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="w-full h-1 bg-secondary cursor-pointer group"
        >
          <div
            className="h-full bg-player-progress group-hover:bg-player-hover transition-colors relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-player-progress opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 gap-4">
        {/* Song info - tap to expand on mobile */}
        <div
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer md:cursor-default"
          onClick={() => setFullScreen(true)}
        >
          <img
            src={currentSong.thumbnail || '/placeholder.svg'}
            alt={currentSong.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{currentSong.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
          <ChevronUp className="w-4 h-4 text-muted-foreground md:hidden flex-shrink-0" />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleShuffle}
            className={`hidden md:block p-2 rounded-lg transition-colors ${
              isShuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button onClick={prevTrack} className="p-2 text-foreground hover:text-primary transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button onClick={nextTrack} className="p-2 text-foreground hover:text-primary transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`hidden md:block p-2 rounded-lg transition-colors ${
              repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>
        </div>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
          {!isYoutube && (
            <span className="text-xs text-muted-foreground font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}

          {/* Volume */}
          <div className="flex items-center gap-2">
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
              className="w-20 accent-primary"
            />
          </div>

          {/* Sleep timer */}
          <div className="relative">
            <button
              onClick={() => setShowSleepMenu(!showSleepMenu)}
              className={`p-2 rounded-lg transition-colors ${
                sleepTimer ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Timer className="w-4 h-4" />
            </button>
            {showSleepMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-popover border border-border rounded-xl p-2 shadow-lg min-w-[120px]">
                {[5, 10, 15, 30, 60].map(min => (
                  <button
                    key={min}
                    onClick={() => { setSleepTimer(min); setShowSleepMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    {min} min
                  </button>
                ))}
                {sleepTimer && (
                  <button
                    onClick={() => { setSleepTimer(null); setShowSleepMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-secondary rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ad placeholder below player */}
      <div className="hidden md:block px-4 pb-2">
        <div className="w-full py-2 rounded-lg bg-secondary border border-border text-center">
          <span className="text-xs text-muted-foreground">Ad Space</span>
        </div>
      </div>
    </div>

    <FullScreenPlayer open={fullScreen} onClose={() => setFullScreen(false)} />
    </>
  );
};

export default PlayerBar;
