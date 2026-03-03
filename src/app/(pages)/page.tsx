"use client"
import SwipeDeck from "@/components/common/SwipeDeck";

export default function Home() {
  return (
    <div className="bg-black overflow-hidden text-white min-h-screen grid pt-8 md:pt-6 xl:pt-2 px-4 md:px-10 xl:px-14 pb-14">
      <h2 className="uppercase text-4xl md:text-6xl xl:text-9xl text-pink-700 text-center">
        Funky Dating
      </h2>
      <div className="flex-1 -mt-120 md:-mt-80">
        <SwipeDeck />
      </div>
    </div>
  );
}