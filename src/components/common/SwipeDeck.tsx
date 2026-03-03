import React, { useState } from "react";
import Card, { Profile } from "./Card";

const mockProfiles: Profile[] = [
  { id: 1, name: "Alice", age: 25, bio: "Loves hiking.", image: "/profiles/alice.jpg" },
  { id: 2, name: "Bob", age: 28, bio: "Coffee addict.", image: "/profiles/bob.jpg" },
  { id: 3, name: "Charlie", age: 32, bio: "Guitarist.", image: "/profiles/charlie.jpg" },
  // …more items or load from an API
];

const SwipeDeck: React.FC = () => {
  const [index, setIndex] = useState(0);

  const advance = () => {
    setIndex(i => (i + 1 < mockProfiles.length ? i + 1 : i));
  };

  const stack = mockProfiles.slice(index, index + 3);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {stack
        .reverse() // render top card last so it’s on top
        .map((profile, idx) => (
          <Card
            key={profile.id}
            profile={profile}
            onSwipe={advance}
            className="absolute"
            style={{ zIndex: idx}}
          />
        ))}
    </div>
  );
};

export default SwipeDeck;