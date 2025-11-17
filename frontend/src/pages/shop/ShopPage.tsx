import React, { useState } from "react";
import "../../assets/scss/Shop/ShopPage.scss";
import Main from "../../components/main/Main";

import hint1Img from "../../assets/img/shop/hint1.png";
import hint3Img from "../../assets/img/shop/hint3.png";
import randomBuffImg from "../../assets/img/shop/randombuff.png";
import timeStopImg from "../../assets/img/shop/timestop.png";

const LOCAL_ITEMS = [
  {
    _id: "item-hint1",
    name: "힌트 1회권",
    description: "문제 힌트를 1번 열람할 수 있습니다.",
    price: 5,
    icon: hint1Img,
  },
  {
    _id: "item-hint3",
    name: "힌트 3회권",
    description: "문제 힌트를 3번 열람할 수 있습니다.",
    price: 12,
    icon: hint3Img,
  },
  {
    _id: "item-buff",
    name: "랜덤 버프 패키지",
    description: "게임에서 버프 효과를 무작위로 획득합니다.",
    price: 15,
    icon: randomBuffImg,
  },
  {
    _id: "item-timestop",
    name: "시간 정지권",
    description: "아레나 타이머를 30초간 멈춥니다.",
    price: 25,
    icon: timeStopImg,
  },
];

const ShopPage: React.FC = () => {
  const [balance, setBalance] = useState(150);

  const handleBuyItem = (id: string) => {
    const item = LOCAL_ITEMS.find((x) => x._id === id);
    if (!item) return;
    if (balance < item.price) return alert("코인이 부족합니다.");
    setBalance(balance - item.price);
    alert(`${item.name}을(를) 구매했습니다.`);
  };

  return (
    <Main>
      <div className="shop-layout">
        <div className="shop-panel">
          <h1 className="shop-title">SHOP TERMINAL</h1>

          <p className="shop-balance">
            CURRENT BALANCE: <strong>{balance} HTO</strong>
          </p>

          <div className="shop-grid">
            {LOCAL_ITEMS.map((item) => (
              <div className="shop-item-card" key={item._id}>
                <img src={item.icon} className="shop-item-card__icon" />

                <div className="shop-item-card__header">
                  <h3>{item.name}</h3>
                  <span>{item.price} HTO</span>
                </div>

                <p className="shop-item-card__desc">{item.description}</p>

                <button
                  className="shop-item-card__btn"
                  onClick={() => handleBuyItem(item._id)}
                >
                  구매
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default ShopPage;
