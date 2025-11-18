import React, { useState, useEffect } from "react";
import "../../assets/scss/Shop/ShopPage.scss";
import Main from "../../components/main/Main";
import Roulette from "../../components/shop/Roulette";

import hint1Img from "../../assets/img/shop/hint1.png";
import hint3Img from "../../assets/img/shop/hint3.png";
import randomBuffImg from "../../assets/img/shop/randombuff.png";
import timeStopImg from "../../assets/img/shop/timestop.png";

/* === 인벤토리 타입 === */
type InventoryItem = {
  itemId: string;
  name: string;
  icon: string;
  description: string;
  count: number;
};

/* === 상점 아이템 목록 === */
export const LOCAL_ITEMS = [
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
  const [tab, setTab] = useState<"shop" | "inventory" | "roulette">("shop");
  const [showNPC, setShowNPC] = useState(false);

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  /* === 인벤토리 로드 === */
  useEffect(() => {
    const saved = localStorage.getItem("HTO_INVENTORY");
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  const saveInventory = (list: InventoryItem[]) => {
    localStorage.setItem("HTO_INVENTORY", JSON.stringify(list));
    setInventory(list);
  };

  /* ================================
     1) 아이템 구매 (count 증가)
  ================================= */
  const handleBuyItem = (id: string) => {
    const item = LOCAL_ITEMS.find((x) => x._id === id);
    if (!item) return;

    if (balance < item.price) {
      alert("코인이 부족합니다.");
      return;
    }

    setBalance(balance - item.price);

    const exists = inventory.find((x) => x.itemId === id);

    let newInventory;

    if (exists) {
      newInventory = inventory.map((x) =>
        x.itemId === id ? { ...x, count: x.count + 1 } : x
      );
    } else {
      newInventory = [
        ...inventory,
        {
          itemId: id,
          name: item.name,
          icon: item.icon,
          description: item.description,
          count: 1,
        },
      ];
    }

    saveInventory(newInventory);

    alert(`${item.name}이(가) 인벤토리에 추가되었습니다.`);
  };

  /* ================================
     2) 아이템 사용 (count 감소)
  ================================= */
  const handleUseItem = (itemId: string) => {
    const target = inventory.find((x) => x.itemId === itemId);
    if (!target) return;

    alert(`${target.name}을 사용했습니다!`);

    let newInventory;

    if (target.count > 1) {
      newInventory = inventory.map((x) =>
        x.itemId === itemId ? { ...x, count: x.count - 1 } : x
      );
    } else {
      newInventory = inventory.filter((x) => x.itemId !== itemId);
    }

    saveInventory(newInventory);
  };

  /* ================================
     3) 룰렛 보상 지급 (count 증가)
  ================================= */
  const handleRouletteReward = (rewardId: string) => {
    const exists = inventory.find((x) => x.itemId === rewardId);

    let newInventory;

    if (exists) {
      newInventory = inventory.map((x) =>
        x.itemId === rewardId ? { ...x, count: x.count + 1 } : x
      );
    } else {
      const item = LOCAL_ITEMS.find((x) => x._id === rewardId);
      newInventory = [
        ...inventory,
        {
          itemId: rewardId,
          name: item?.name || "보상 아이템",
          icon: item?.icon || "",
          description: item?.description || "",
          count: 1,
        },
      ];
    }

    saveInventory(newInventory);
  };

  return (
    <Main>
      <div className="shop-layout">
        <div className="shop-panel">
          <h1 className="shop-title">SHOP TERMINAL</h1>

          <p className="shop-balance">
            CURRENT BALANCE: <strong>{balance} HTO</strong>
          </p>

          {/* === 탭 === */}
          <div className="shop-tabs">
            <button className={tab === "shop" ? "active" : ""} onClick={() => setTab("shop")}>
              상점
            </button>

            <button className={tab === "inventory" ? "active" : ""} onClick={() => setTab("inventory")}>
              인벤토리
            </button>

            <button className={tab === "roulette" ? "active" : ""} onClick={() => setTab("roulette")}>
              룰렛
            </button>

            <button className="npc-btn" onClick={() => setShowNPC(true)}>
              ?
            </button>
          </div>

          {/* === 상점 === */}
          {tab === "shop" && (
            <div className="shop-grid">
              {LOCAL_ITEMS.map((item) => (
                <div className="shop-item-card" key={item._id}>
                  <img src={item.icon} className="shop-item-card__icon" />

                  <div className="shop-item-card__header">
                    <h3>{item.name}</h3>
                    <span>{item.price} HTO</span>
                  </div>

                  <p className="shop-item-card__desc">{item.description}</p>

                  <button className="shop-item-card__btn" onClick={() => handleBuyItem(item._id)}>
                    구매
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* === 인벤토리 === */}
          {tab === "inventory" && (
            <div className="inventory-grid">
              {inventory.length === 0 ? (
                <div className="placeholder">📦 보유한 아이템이 없습니다.</div>
              ) : (
                inventory.map((item) => (
                  <div className="inventory-item-card" key={item.itemId}>
                    <img src={item.icon} className="inventory-item-card__icon" />

                    <div className="inventory-item-card__header">
                      <h3>{item.name}</h3>
                      <span className="inventory-count">x{item.count}</span>
                    </div>

                    <p className="inventory-item-card__desc">{item.description}</p>

                    <button
                      className="inventory-item-card__btn"
                      onClick={() => handleUseItem(item.itemId)}
                    >
                      사용하기
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* === 룰렛 === */}
          {tab === "roulette" && (
            <Roulette 
              balance={balance}
              setBalance={setBalance}
              onReward={handleRouletteReward}
            />
          )}

          {/* === NPC 모달 === */}
          {showNPC && (
            <div className="npc-modal">
              <div className="npc-box">
                <h2>💬 상점 안내</h2>
                <p>아이템 구매 및 룰렛 사용이 가능합니다.</p>
                <button onClick={() => setShowNPC(false)}>닫기</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Main>
  );
};

export default ShopPage;
