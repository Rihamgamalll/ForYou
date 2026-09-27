"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  onDone?: () => void;
}

export default function Typewriter({
  text,
  speed = 35,
  startDelay = 0,
  className = "",
  onDone,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(setTimeout(() => {}, 0));

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    const startTimer = setTimeout(() => {
      let i = 0;
      const tick = () => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
          timeoutRef.current = setTimeout(tick, speed);
        } else {
          setDone(true);
          onDone?.();
        }
      };
      tick();
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay]);

  return (
    <span className={`${className} ${!done ? "typewriter-caret" : ""}`}>
      {displayed}
    </span>
  );
}
