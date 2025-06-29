import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface SoundTrack {
  id: string;
  name: string;
  description: string;
  emoji: string;
  url: string;
}

interface SoundscapeContextType {
  currentTrack: SoundTrack | null;
  isPlaying: boolean;
  volume: number;
  tracks: SoundTrack[];
  playTrack: (trackId: string) => void;
  pauseTrack: () => void;
  setVolume: (volume: number) => void;
}

const SoundscapeContext = createContext<SoundscapeContextType | undefined>(undefined);

export const useSoundscape = () => {
  const context = useContext(SoundscapeContext);
  if (context === undefined) {
    throw new Error('useSoundscape must be used within a SoundscapeProvider');
  }
  return context;
};

const TRACKS: SoundTrack[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    description: 'Soft rainfall for reflection',
    emoji: '🌧️',
    url: 'https://www.soundjay.com/misc/sounds/rain-01.wav', // Placeholder - would use actual ambient tracks
  },
  {
    id: 'library',
    name: 'Library Ambience',
    description: 'Quiet study atmosphere',
    emoji: '📚',
    url: 'https://www.soundjay.com/misc/sounds/library-ambience.wav', // Placeholder
  },
  {
    id: 'piano',
    name: 'Soft Piano',
    description: 'Gentle melodies for writing',
    emoji: '🎹',
    url: 'https://www.soundjay.com/misc/sounds/piano-soft.wav', // Placeholder
  },
  {
    id: 'forest',
    name: 'Forest Sounds',
    description: 'Birds and rustling leaves',
    emoji: '🌲',
    url: 'https://www.soundjay.com/misc/sounds/forest.wav', // Placeholder
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Calming seaside sounds',
    emoji: '🌊',
    url: 'https://www.soundjay.com/misc/sounds/ocean-waves.wav', // Placeholder
  },
];

export const SoundscapeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<SoundTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved preferences
  useEffect(() => {
    const savedVolume = localStorage.getItem('sealya-soundscape-volume');
    const savedTrack = localStorage.getItem('sealya-soundscape-track');
    
    if (savedVolume) {
      setVolumeState(parseFloat(savedVolume));
    }
    
    if (savedTrack) {
      const track = TRACKS.find(t => t.id === savedTrack);
      if (track) {
        setCurrentTrack(track);
      }
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('sealya-soundscape-volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('sealya-soundscape-track', currentTrack.id);
    }
  }, [currentTrack]);

  // Handle audio
  useEffect(() => {
    if (currentTrack && isPlaying) {
      // In a real implementation, you would load and play actual audio files
      // For now, we'll simulate the audio playback
      console.log(`Playing: ${currentTrack.name} at volume ${volume}`);
    }
  }, [currentTrack, isPlaying, volume]);

  const playTrack = (trackId: string) => {
    const track = TRACKS.find(t => t.id === trackId);
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <SoundscapeContext.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      tracks: TRACKS,
      playTrack,
      pauseTrack,
      setVolume,
    }}>
      {children}
    </SoundscapeContext.Provider>
  );
};