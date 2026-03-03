import React from "react";
import {
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";

export interface Profile {
  id: number;
  name: string;
  image: string;
  age?: number;
  bio?: string;
}

interface CardProps {
  profile: Profile;
  onSwipe?: (direction: "left" | "right") => void;
  className?: string;
  style?: React.CSSProperties;
}

const SWIPE_THRESHOLD = 150; // px

const Card: React.FC<CardProps> = ({
  profile,
  onSwipe = () => {},
  className = "",
  style = {},
}) => {
  const x = useMotionValue(0);
  const controls = useAnimation();

  // rotate a bit depending on how far dragged
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  const exit = (direction: "left" | "right") => {
    const toX = direction === "right" ? 1000 : -1000;

    // animate off‑screen, fade, enlarge
    controls
      .start({
        x: toX,
        opacity: 0,
        scale: 1.5,
        transition: { duration: 0.5 },
      })
      .then(() => onSwipe(direction));
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offsetX = info.offset.x;
    const velocity = info.velocity.x;

    if (offsetX > SWIPE_THRESHOLD || velocity > 800) {
      exit("right");
    } else if (offsetX < -SWIPE_THRESHOLD || velocity < -800) {
      exit("left");
    } else {
      // spring back to centre if not swiped away
      x.set(0);
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-4xl aspect-9/16 h-[40vh] md:h-[69vh] mx-auto ${className}`}
      style={{ ...style, x, rotate }}
      animate={controls}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.16}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.97 }}
      whileDrag={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      layout
    >
      <img
        src={profile.image}
        alt={profile.name}
        className="rounded-4xl object-cover w-full h-full"
      />
      <div className="absolute bottom-0 left-0 p-4 text-black bg-white/80 w-full rounded-b-4xl">
        <h3 className="text-xl font-bold">
          {profile.name}
          {profile.age && `, ${profile.age}`}
        </h3>
        {profile.bio && <p className="text-sm">{profile.bio}</p>}
      </div>
    </motion.div>
  );
};

export default Card;