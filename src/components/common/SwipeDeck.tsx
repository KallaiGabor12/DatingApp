import React, { useState, useEffect, useRef } from "react";
import Card, { Profile } from "./Card";

const mockProfiles: Profile[] = [
  { id: 1, name: "Alice", age: 25, bio: "Loves hiking.", image: "/profiles/alice.jpg" },
  { id: 2, name: "Bob", age: 28, bio: "Coffee addict.", image: "/profiles/bob.jpg" },
  { id: 3, name: "Charlie", age: 32, bio: "Guitarist.", image: "/profiles/charlie.jpg" },
  // …more items or load from an API
];

const SwipeDeck: React.FC = () => {
  const [index, setIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const advance = () => {
    setIndex(i => (i + 1 < mockProfiles.length ? i + 1 : i));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    

    audio.loop = true;
    audio.volume = 0.5; // adjust as desired

    // Try to play on mount; browsers may block autoplay until user interaction.
    
    const tryControl = async (play:boolean = true) => {
      try {
        if(play) await audio.play();
        else await audio.pause();
      } catch (e) {
        console.error(e) 
        // Autoplay blocked — user can start playback manually (browser policy).
        // You can optionally show a play button to start audio.
      }
    };
    tryControl();

    const handleVisibilityChange = async() => {
      tryControl(document.visibilityState === 'visible')
    };

    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const stack = mockProfiles.slice(index, index + 3);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {/* Hidden audio element that plays the provided mp3 on repeat */}
      <audio id="audio" ref={audioRef} src="/music/sneakman.mp3" aria-hidden="true" />

      {stack
        .reverse() // render top card last so it’s on top
        .map((profile, idx) => (
          <Card
            key={profile.id}
            profile={profile}
            onSwipe={advance}
            className="absolute"
            style={{ zIndex: idx }}
          />
        ))}
    </div>
  );
};

export default SwipeDeck;