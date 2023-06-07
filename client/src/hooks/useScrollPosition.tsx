import { useState, useEffect } from "react";
import { TScrollPosition } from "../@types/TScrollPosition";

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState<TScrollPosition>({ top: 0, bottom: 0});

  const handleScroll = () => {
    const topPos = window.scrollY;
    const bottomPos = window.scrollY + window.innerHeight;
    setScrollPosition({ top: topPos, bottom: bottomPos });
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, false);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return scrollPosition;
}