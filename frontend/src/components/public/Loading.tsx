import React, { useEffect, useState } from "react";

import img1 from "../../assets/img/Fullscreen_black.png";
import img2 from "../../assets/img/screennoise.png";
import img3 from "../../assets/img/Fullscreen.png";
import img4 from "../../assets/img/screennoise1.png";
import img5 from "../../assets/img/screennoise2.png";
import img6 from "../../assets/img/screennoise3.png";
import img7 from "../../assets/img/screennoise4.png";

const images = [img1, img2, img3, img4, img5, img6, img7];

const Loading: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const current = images[index];
  const isNoise = index >= 2; // img3 ~ img7 구간만 노이즈 계열

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* ✅ 이미지 표시 */}
      <img
        src={current}
        alt={`frame-${index}`}
        draggable="false"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: 1,
          // ✅ 노이즈 이미지면 강제 색상/밝기 부스트
          filter: isNoise
            ? "brightness(3) contrast(2.5) saturate(2.5) hue-rotate(30deg)"
            : "brightness(1) contrast(1)",
          mixBlendMode: "normal",
          zIndex: 1,
          transition: "filter 0.1s linear, transform 0.1s linear",
          transform: `scale(${1 + Math.random() * 0.02})`,
        }}
      />

      {/* ✅ 노이즈일 때는 컬러 오버레이 추가 */}
      {isNoise && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, rgba(0,255,255,0.1) 0px, rgba(255,0,193,0.15) 2px, transparent 4px)",
            mixBlendMode: "screen",
            opacity: 0.6,
            zIndex: 1.5,
            pointerEvents: "none",
          }}
        ></div>
      )}

      {/* 중앙 텍스트 */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          textAlign: "center",
          width: "100%",
          color: "#00eaff",
          fontFamily: "'Orbitron', 'Press Start 2P', sans-serif",
          fontSize: "2rem",
          fontWeight: 700,
          textShadow:
            "0 0 8px #00ffff, 0 0 16px #00ffff, 0 0 24px #ff00c1, 0 0 40px rgba(0,255,255,0.4)",
          zIndex: 3,
          letterSpacing: "2px",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <span style={{ color: "#00ffff", marginRight: "8px" }}>HACK</span>
        <span style={{ color: "#ff00c1" }}>THIS OUT 2.0</span>
      </div>

      {/* 인덱스 표시 (디버그용) */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          color: "#fff",
          fontFamily: "monospace",
          fontSize: "14px",
          zIndex: 5,
        }}
      >
        frame: {index + 1} / {images.length}
      </div>
    </div>
  );
};

export default Loading;
