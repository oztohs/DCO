import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "../../assets/scss/etc/loading.module.scss";

import fullscreenBlack from "../../assets/img/Fullscreen_black.png";
import fullscreen from "../../assets/img/Fullscreen.png";
import screennoise from "../../assets/img/screennoise.png";
import screennoise1 from "../../assets/img/screennoise_L.png";
import screennoise2 from "../../assets/img/screennoise2.png";
import screennoise3 from "../../assets/img/screennoise3.png";
import screennoise4 from "../../assets/img/screennoise4.png";

/**
 * Cyberpunk-style "glitchy" fast flickering loading background
 * - 랜덤 속도 + 프레임 흔들림 효과
 */
const Loading: React.FC<{ className?: string }> = ({ className }) => {
  const frames = useMemo(
    () => [
      fullscreenBlack,
      fullscreen,
      screennoise,
      screennoise1,
      screennoise2,
      screennoise3,
      screennoise4,
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const runningRef = useRef<boolean>(!document.hidden);
  const aliveRef = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    frames.forEach((src) => {
      const img = new Image();
      img.src = src as string;
    });
  }, [frames]);

  const schedule = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (!aliveRef.current || !runningRef.current) return;

    // 🔹 랜덤 간격 (지직거림 효과용)
    // 60~180ms 사이에서 랜덤, 가끔 30ms로 빠르게 튐
    const randomInterval = Math.random() < 0.15 ? 30 : Math.random() * 120 + 60;

    timeoutRef.current = window.setTimeout(() => {
      // 🔹 약간의 랜덤 인덱스 점프
      const jump = Math.random() < 0.1 ? 2 : 1;
      setIdx((prev) => (prev + jump) % frames.length);
      schedule();
    }, randomInterval);
  };

  useEffect(() => {
    aliveRef.current = true;
    schedule();
    return () => {
      aliveRef.current = false;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [frames.length]);

  return (
    <div className={className ?? styles.loadingContainer}>
      <img
        key={idx}
        src={frames[idx]}
        alt={`loading-frame-${idx}`}
        className={styles.baseImage}
        style={{
          transform: `translate(${Math.random() * 3 - 1.5}px, ${
            Math.random() * 3 - 1.5
          }px)`, // 🔹 살짝 흔들림
          filter: `brightness(${0.9 + Math.random() * 0.4}) contrast(${
            1.1 + Math.random() * 0.4
          })`, // 🔹 밝기/대비 지직 효과
        }}
      />

      <div className={styles.textOverlay}>
        <h1>HACK</h1>
        <p>THIS OUT 2.0</p>
      </div>
    </div>
  );
};

export default Loading;
