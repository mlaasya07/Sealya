import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useSoundscape } from '../contexts/SoundscapeContext';

export const SoundscapeControls: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    setVolume, 
    playTrack, 
    pauseTrack,
    tracks 
  } = useSoundscape();

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-pink-900 dark:text-fuchsia-100 mb-2 flex items-center">
          <span className="text-2xl mr-2">🎧</span>
          Soundscapes
        </h3>
        <p className="text-sm text-pink-600 dark:text-fuchsia-300 font-mono">
          Ambient sounds to help you focus and connect with your emotions.
        </p>
      </div>

      {/* Volume Control */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-mono text-pink-700 dark:text-fuchsia-300">Volume</span>
          <div className="flex items-center space-x-2">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-pink-600 dark:text-fuchsia-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-pink-600 dark:text-fuchsia-400" />
            )}
            <span className="text-sm font-mono text-pink-600 dark:text-fuchsia-400 w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-pink-200 dark:bg-fuchsia-800 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-600 dark:[&::-webkit-slider-thumb]:bg-fuchsia-500
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
          />
        </div>
      </div>

      {/* Track Selection */}
      <div className="flex-1">
        <h4 className="text-sm font-mono text-pink-700 dark:text-fuchsia-300 mb-3">Choose Your Ambience</h4>
        <div className="space-y-2">
          {tracks.map((track) => (
            <motion.button
              key={track.id}
              onClick={() => currentTrack?.id === track.id ? pauseTrack() : playTrack(track.id)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                currentTrack?.id === track.id
                  ? 'bg-pink-200 dark:bg-fuchsia-800 text-pink-900 dark:text-fuchsia-100'
                  : 'bg-pink-50 dark:bg-fuchsia-900/30 hover:bg-pink-100 dark:hover:bg-fuchsia-900/50 text-pink-700 dark:text-fuchsia-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{track.emoji}</span>
                  <div>
                    <div className="font-mono font-semibold text-sm">{track.name}</div>
                    <div className="text-xs opacity-75">{track.description}</div>
                  </div>
                </div>
                
                {currentTrack?.id === track.id && (
                  <div className="flex items-center space-x-2">
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="mt-4 pt-4 border-t border-pink-200 dark:border-fuchsia-700">
          <div className="text-center">
            <div className="text-sm font-mono text-pink-600 dark:text-fuchsia-400 mb-2">
              {isPlaying ? 'Now Playing' : 'Paused'}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">{currentTrack.emoji}</span>
              <span className="font-mono text-sm text-pink-800 dark:text-fuchsia-200">
                {currentTrack.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};