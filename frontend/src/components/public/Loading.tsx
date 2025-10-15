import React, { useEffect, useRef, useState } from 'react';
import styles from '../../assets/scss/etc/loading.module.scss';
import fullscreenBlack from '../../assets/img/Fullscreen_black.png';
import fullscreen from '../../assets/img/Fullscreen.png';

const images = [fullscreenBlack, fullscreen];

const Loading: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPreGlitch, setIsPreGlitch] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 주기적 글리치 전환
    const intervalId = setInterval(() => {
      setIsPreGlitch(true);

      // 빠른 글리치 후 메인 전환
      setTimeout(() => {
        setIsPreGlitch(false);
        setIsTransitioning(true);

        setTimeout(() => {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
          setIsTransitioning(false);
        }, 500);
      }, 350);
    }, 5000);

    // 4초 후 페이드아웃
    const fadeTimer = setTimeout(() => setFadeOut(true), 4000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(fadeTimer);
    };
  }, []);

  const currentImage = images[currentImageIndex];
  const style = {
    backgroundImage: `url(${currentImage})`,
  };

  return (
    <div
      ref={containerRef}
      style={style}
      className={`
        ${styles.glitch}
        ${isTransitioning ? styles.transitioning : ''}
        ${isPreGlitch ? styles.preGlitch : ''}
        ${fadeOut ? styles.fadeOut : ''}
      `}
    >
      {/* RGB 채널 겹침 */}
      <div className={`${styles.channel} ${styles.r}`}></div>
      <div className={`${styles.channel} ${styles.g}`}></div>
      <div className={`${styles.channel} ${styles.b}`}></div>
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
