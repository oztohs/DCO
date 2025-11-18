import React, { useState } from "react";
import "../../assets/scss/Shop/Roulette.scss";

interface RouletteProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  onReward: (rewardId: string) => void;
}

const Roulette: React.FC<RouletteProps> = ({ balance, setBalance, onReward }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [resultItem, setResultItem] = useState<string | null>(null);

  /* 
    ⭐ 실제 UI 기준 슬롯 순서 (화살표 TOP 기준 시계방향)

        ▼ (TOP)
     LEFT      RIGHT
        BOTTOM

    index 0 = TOP  → 힌트 1회권
    index 1 = RIGHT → 힌트 3회권
    index 2 = BOTTOM → 랜덤 버프 패키지
    index 3 = LEFT → 시간 정지권
  */
  const rouletteItems = [
    { id: "item-hint1", label: "힌트 1회권", weight: 40 },      // TOP
    { id: "item-hint3", label: "힌트 3회권", weight: 25 },      // RIGHT
    { id: "item-buff", label: "랜덤 버프 패키지", weight: 20 }, // BOTTOM
    { id: "item-timestop", label: "시간 정지권", weight: 15 }   // LEFT
  ];

  /*
    🔥 현재 관찰된 동작 기준으로 역추적한 중앙 각도 매핑

    - 이전 상태:
      45° → 랜덤버프
      135° → 힌트 3회권 (정상)
      225° → 힌트 1회권
      315° → 시간 정지권 (정상)

    그래서:
      index 0(힌트1) 에 225°를,
      index 2(랜덤버프) 에 45°를 배정하면
      네가 말한 “힌트1↔랜덤버프 뒤바뀜”이 정확히 해결됨.
  */
  const slotCenterAngles = [225, 135, 45, 315];

  const spinRoulette = () => {
    if (isRolling) return;

    if (balance < 10) {
      alert("코인이 부족합니다. (필요: 10 HTO)");
      return;
    }

    setBalance(prev => prev - 10);
    setIsRolling(true);

    // 1) 확률 기반 선택
    const totalWeight = rouletteItems.reduce(
      (sum, item) => sum + item.weight,
      0
    );
    const rand = Math.random() * totalWeight;

    let acc = 0;
    let selected = rouletteItems[0];

    for (const item of rouletteItems) {
      acc += item.weight;
      if (rand <= acc) {
        selected = item;
        break;
      }
    }

    const selectedIndex = rouletteItems.indexOf(selected);

    // 2) 회전 초기화
    const wheel = document.getElementById("roulette-wheel") as HTMLElement;

    if (wheel) {
      wheel.style.transition = "none";
      wheel.style.transform = "rotate(0deg)";
    }

    setTimeout(() => {
      if (wheel) {
        wheel.style.transition =
          "transform 4s cubic-bezier(0.1, 0.95, 0.37, 1)";
      }
    }, 50);

    // 3) 최종 회전 각도
    const finalAngle = 360 * 6 + slotCenterAngles[selectedIndex];

    setTimeout(() => {
      if (wheel) {
        wheel.style.transform = `rotate(${finalAngle}deg)`;
      }
    }, 80);

    // 4) 지급
    setTimeout(() => {
      setResultItem(selected.label);
      onReward(selected.id);
      setIsRolling(false);
    }, 4200);
  };

  return (
    <div className="roulette-container">
      <h2 className="roulette-title">🎰 HTO 룰렛</h2>

      <p className="roulette-sub">
        1회 비용: <strong>10 HTO</strong>
      </p>

      <div className="roulette-wheel-box">
        <div className="roulette-wheel" id="roulette-wheel">
          {rouletteItems.map((item, index) => (
            <div
              key={index}
              className="roulette-segment"
              style={{
                transform: `rotate(${(360 / rouletteItems.length) * index}deg)`
              }}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="roulette-pointer">▼</div>
      </div>

      <button
        className="roulette-button"
        onClick={spinRoulette}
        disabled={isRolling}
      >
        {isRolling ? "돌리는 중..." : "START"}
      </button>

      {resultItem && (
        <div className="roulette-result">
          🎉 축하합니다! <strong>{resultItem}</strong>을(를) 획득했습니다!
        </div>
      )}
    </div>
  );
};

export default Roulette;
