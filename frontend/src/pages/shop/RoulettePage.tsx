import React, { useState } from 'react';
import Main from '../../components/main/Main';
import '../../assets/scss/shop/RoulettePage.scss';

const RoulettePage: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const prizes = [
    '힌트 1회권',
    '힌트 3회권',
    '경험치 부스터 (5판)',
    '닉네임 변경권',
    '색상 변경권 (랜덤)',
    '색상 변경권 (선택형)'
  ];

  const spin = () => {
    const reward = prizes[Math.floor(Math.random() * prizes.length)];
    setResult(reward);
  };

  return (
    <Main>
      <div className="roulette-container">
        <h1 className="roulette-title">HTO ROULETTE</h1>
        <button className="roulette-spin-btn" onClick={spin}>
          [ SPIN ]
        </button>
        {result && <p className="roulette-result">🎉 당첨: {result} 🎉</p>}
      </div>
    </Main>
  );
};

export default RoulettePage;
