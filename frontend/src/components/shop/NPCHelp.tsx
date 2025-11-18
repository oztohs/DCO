import React, { useState } from "react";
import "../../assets/scss/shop/NPCHelp.scss";
import HackCat from "../../assets/img/icon/Hack cat.png";

interface NPCHelpProps {
  open: boolean;
  onClose: () => void;
}

const NPCHelp: React.FC<NPCHelpProps> = ({ open, onClose }) => {
  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  /* === FAQ 목록 === */
  const faqList = [
    {
      key: "shop",
      question: "상점은 어떻게 이용해?",
      answer:
        "상점에서는 HTO 코인으로 아이템을 구매할 수 있어! 각 아이템은 게임에서 유용하게 사용될 수 있어.",
    },
    {
      key: "roulette",
      question: "룰렛은 어떻게 돌아가?",
      answer:
        "룰렛은 10 HTO로 1회 돌릴 수 있어. 확률에 따라 아이템을 랜덤하게 획득할 수 있지!",
    },
    {
      key: "inventory",
      question: "인벤토리는 뭐야?",
      answer:
        "인벤토리는 네가 보유하고 있는 아이템을 볼 수 있는 곳이야. 아이템을 직접 사용도 할 수 있어!",
    },
    {
      key: "coin",
      question: "HTO 코인은 어떻게 모아?",
      answer:
        "문제를 풀거나 이벤트에 참여하면 HTO 코인을 얻을 수 있어. 앞으로 더 많은 획득 방법이 추가될 거야!",
    },
    {
      key: "chance",
      question: "룰렛 확률 알려줘!",
      answer:
        "현재 룰렛 확률은 다음과 같아!\n\n" +
        "🎯 힌트 1회권: 40%\n" +
        "🎯 힌트 3회권: 25%\n" +
        "🎯 랜덤 버프 패키지: 20%\n" +
        "🎯 시간 정지권: 15%",
    },
  ];

  /* === 선택된 답변 === */
  const selectedAnswer = faqList.find((item) => item.key === selected)?.answer;

  return (
    <div className="npc-help-box">
      <div className="npc-inner">

        {/* 해커냥 이미지 */}
        <div className="npc-avatar">
          <img src={HackCat} alt="HackCat" />
        </div>

        {/* 인사 메시지 */}
        <div className="npc-message">
          <p>
            <strong>안녕! 나는 해커냥이야 😺</strong>
          </p>
          <p>궁금한 게 있으면 언제든지 나에게 물어봐!</p>
        </div>

        {/* FAQ 목록 버튼 */}
        <div className="npc-faq-list">
          {faqList.map((item) => (
            <button
              key={item.key}
              className="faq-btn"
              onClick={() => setSelected(item.key)}
            >
              {item.question}
            </button>
          ))}
        </div>

        {/* 답변 박스 */}
        {selectedAnswer && (
          <div className="npc-answer-box">
            {selectedAnswer.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}

        {/* 닫기 버튼 */}
        <button className="npc-close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default NPCHelp;
