import React, { useEffect, useRef, useState } from 'react';
import styles from '../../assets/scss/etc/loading.module.scss';
import hackText from '../../assets/img/Fullscreen_black.png';
import hackLogo from '../../assets/img/Fullscreen_nobg.png';
import hackFull from '../../assets/img/Fullscreen.png';
import screen1 from '../../assets/img/screennoise.png';
import screen2 from '../../assets/img/screennoise1.png';
import screen3 from '../../assets/img/screennoise2.png';
import screen4 from '../../assets/img/screennoise3.png';
import screen5 from '../../assets/img/screennoise4.png';

const images = [
  hackText, screen1, screen2,
  hackLogo, screen3, screen4,
  hackFull, screen5
];

const Loading: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // === 글리치 효과 전환 ===
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 450); // 약 0.45초 간격 (지직지직 느낌)

    // === 페이드아웃 타이밍 ===
    const fadeTimer = setTimeout(() => setFadeOut(true), 8000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(fadeTimer);
    };
  }, []);

  const currentImage = images[currentImageIndex];
  const style = {
    backgroundImage: `url(${currentImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  return (
    <div
      ref={containerRef}
      style={style}
      className={`
        ${styles.glitch}
        ${fadeOut ? styles.fadeOut : ''}
      `}
    >
      <div className={styles.channel + ' ' + styles.r}></div>
      <div className={styles.channel + ' ' + styles.g}></div>
      <div className={styles.channel + ' ' + styles.b}></div>
      <div className={styles.noise}></div>

      {/* 중앙 텍스트 */}
      <div className={styles.introText}>
        <span className={styles.hack}>HACK</span>
        <span className={styles.thisOut}>THIS OUT 2.0</span>
      </div>
    </div>
  );
};

export default Loading;
