"use client"
import SwipeDeck from "@/components/common/SwipeDeck";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const readyAudioRef = useRef<HTMLAudioElement | null>(null);
  const [ready,setReady] = useState<boolean>(false)
  const [className,setClassName] = useState<string>("")
  const [prevclassName,setPrevClassName] = useState<string>("")

  const handleShake = () => {
    if(prevclassName == "shakeRight") {
      setClassName("shakeLeft")
      setPrevClassName("shakeLeft")
    }else{
      setClassName("shakeRight")
      setPrevClassName("shakeRight")
    } 
    setTimeout(()=>{
      setClassName("")
    },150)

  }

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
  }, [ready]);
  useEffect(() => {
    const readyAudio = readyAudioRef.current;
    if (!readyAudio) return;
    

    readyAudio.loop = true;
    readyAudio.volume = 0.5; // adjust as desired

    // Try to play on mount; browsers may block autoplay until user interaction.
    
    const tryControl = async (play:boolean = true) => {
      try {
        if(play) await readyAudio.play();
        else await readyAudio.pause();
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

    
    document.addEventListener('click', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleVisibilityChange);
      readyAudio.pause();
      readyAudio.currentTime = 0;
    };
  }, [ready]);
  return ready ? (
    <div className={`${className} bg-black overflow-hidden text-white min-h-screen grid pt-8 md:pt-6 xl:pt-2 px-4 md:px-10 xl:px-14 pb-14`}>
      <audio id="audio" ref={audioRef} src="/music/sneakman.mp3" aria-hidden="true" />
      <h1 className="uppercase !font-superfunky text-4xl md:text-6xl xl:text-9xl text-pink-700 text-center">
        Funky Dating
      </h1>
      <div className="flex-1 -mt-120 md:-mt-80">
        <SwipeDeck onSwipe={handleShake} />
      </div>
    </div>
  ) :  <div className="bg-black overflow-hidden text-white min-h-screen grid pt-8 md:pt-6 xl:pt-2 px-4 md:px-10 xl:px-14 pb-14">
    <audio id="readyAudioRef" ref={readyAudioRef} src="/music/theconceptoflove.mp3" aria-hidden="true" />
    <h1 className="uppercase !font-jetsetradio text-4xl md:text-6xl xl:text-9xl text-pink-700 text-center">
        Are you ready?
    </h1>
    
    <button className="bg-[rgba(0,0,0,0.3)] rounded-2xl mt-1 m-auto text-4xl px-5 py-3" onClick={()=>setReady(!ready)}>
      <strong>It's freaky time!</strong>
    </button>
  </div>;
}