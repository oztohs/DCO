<<<<<<< HEAD
// src/pages/ShopPage.tsx
import React, { useEffect, useState } from "react";
import { getShopItems, buyShopItem, getInventory } from "../../api/axiosShop";
import { getUserDetail } from "../../api/axiosUser";
import { ShopItem } from "../../types/ShopItem";
import "../../assets/scss/Shop/ShopPage.scss";
import Main from "../../components/main/Main";
import { toast } from "react-toastify";
import mascotImg from "../../assets/img/icon/Hack cat.png";

// 룰렛 아이콘
import hint1 from "../../assets/img/shop/hint1.png";
import hint3 from "../../assets/img/shop/hint3.png";
import exp_boost from "../../assets/img/shop/exp_boost.png";
import rename from "../../assets/img/shop/rename.png";
import random_color from "../../assets/img/shop/random_color.png";
import select_color from "../../assets/img/shop/select_color.png";

type UIShopItem = ShopItem & { mock?: boolean };

type InventoryEntry = {
  _id: string;
  item: ShopItem | null;
  isUsed: boolean;
  acquiredAt: string;
};

const ShopPage: React.FC = () => {
  const [items, setItems] = useState<UIShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [invLoading, setInvLoading] = useState(true);
  const [showInventory, setShowInventory] = useState(false); // ✅ 인벤토리 상태

  const [showGuideDialogue, setShowGuideDialogue] = useState(false);
  const [npcDialogueStep, setNpcDialogueStep] = useState<
    "menu" | "coin" | "items" | "roulette"
  >("menu");

  const [showRoulette, setShowRoulette] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ name: string } | null>(null);

  // ✅ 더미 아이템 복구
  const dummyItems: UIShopItem[] = [
    { _id: "mock-hint1", name: "힌트 1회권", description: "어려운 문제에 단서가 필요할 때 사용합니다.", price: 5 },
    { _id: "mock-hint3", name: "힌트 3회권", description: "3개의 힌트를 열람할 수 있는 강력한 아이템입니다.", price: 12 },
    { _id: "mock-xp5", name: "경험치 부스터 (5판)", description: "5판 동안 경험치가 2배로 증가합니다.", price: 15 },
    { _id: "mock-rename", name: "닉네임 변경권", description: "닉네임을 자유롭게 변경할 수 있습니다.", price: 25 },
    { _id: "mock-nick-r", name: "닉네임 색상 랜덤 변경권", description: "닉네임 색상을 랜덤으로 변경합니다.", price: 30 },
    { _id: "mock-nick-s", name: "닉네임 색상 선택 변경권", description: "원하는 색상으로 닉네임 색상을 바꿀 수 있습니다.", price: 50 },
  ];

  // === 데이터 로드 ===
  const fetchAll = async () => {
    setLoading(true);
    setInvLoading(true);
    try {
      const [itemsData, me, invData] = await Promise.all([
        getShopItems(),
        getUserDetail(),
        getInventory(),
      ]);

      const serverItems: UIShopItem[] = Array.isArray(itemsData) ? itemsData : [];
      const seen = new Set(serverItems.map((it) => (it.name || "").trim().toLowerCase()));
      const merged = [
        ...serverItems,
        ...dummyItems.filter((d) => !seen.has((d.name || "").trim().toLowerCase())),
      ];

      setItems(merged);
      setBalance(typeof me?.user?.htoCoin === "number" ? me.user.htoCoin : 0);
      setInventory(Array.isArray(invData) ? invData : []);
    } catch {
      toast.error("상점 데이터를 불러오지 못했습니다.");
      setItems(dummyItems);
      setBalance(0);
=======
import React, { useEffect, useState } from 'react';
import { getShopItems, buyShopItem } from '../../api/axiosShop';
import { ShopItem } from '../../types/ShopItem';
import ShopItemCard from '../../components/Shop/ShopItemCard';
import '../../assets/scss/Shop/ShopPage.scss';
import Main from '../../components/main/Main';
import { toast } from 'react-toastify';

const ShopPage: React.FC = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 아이템 불러오기
  const fetchItems = async () => {
    try {
      const data = await getShopItems(); // ✅ ShopItem[] 직접 반환
      setItems(data);
    } catch (err) {
      toast.error('상점 아이템 불러오기 실패');
>>>>>>> 8a2f305e38722205d8e16bbbe85f4a4da737d06d
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    fetchAll();
  }, []);

  // === 아이템 구매 ===
=======
  // 아이템 구매 처리
>>>>>>> 8a2f305e38722205d8e16bbbe85f4a4da737d06d
  const handleBuyItem = async (itemId: string) => {
    try {
<<<<<<< HEAD
      setBuyingId(itemId);
      const msg = await buyShopItem(itemId);
      toast.success(msg || "아이템 구매 성공!");
      await fetchAll();
    } catch (e: any) {
      toast.error(e?.response?.data?.msg || "구매 실패");
    } finally {
      setBuyingId(null);
    }
  };

  // === 룰렛 ===
  const handleSpin = () => {
    if (balance === null || balance < 3) return toast.error("코인이 부족합니다.");
    setSpinning(true);
    setResult(null);
    setBalance((prev) => (prev ?? 0) - 3);
    setTimeout(() => {
      const roulettePool = [
        "힌트 1회권",
        "힌트 3회권",
        "경험치 부스터 (5판)",
        "닉네임 변경권",
        "닉네임 색상 랜덤 변경권",
        "닉네임 색상 선택 변경권",
      ];
      const selected = roulettePool[Math.floor(Math.random() * roulettePool.length)];
      setResult({ name: selected });
      setSpinning(false);
      toast.success(`🎉 ${selected} 당첨!`);
    }, 3000);
  };

  // === ESC 키로 닫기 ===
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowRoulette(false);
        setShowInventory(false);
        setShowGuideDialogue(false);
        setNpcDialogueStep("menu");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Main>
      <div className="shop-layout--blueprint">
        <section className="panel--blueprint">
          <div
            className="panel__header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 className="panel__title">SHOP TERMINAL</h1>
            <div className="cy-toolbar">
              <select
                className="cy-select"
                defaultValue="price-asc"
                onChange={(e) => {
                  const v = e.target.value;
                  setItems((prev) => {
                    const arr = [...prev];
                    if (v === "price-desc") return arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
                    if (v === "name-asc") return arr.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
                    return arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
                  });
                }}
              >
                <option value="price-asc">가격 낮은순</option>
                <option value="price-desc">가격 높은순</option>
                <option value="name-asc">이름순</option>
              </select>
              <button onClick={() => setShowInventory(true)} style={toolbarBtnStyle}>
                🎒 인벤토리
              </button>
              <button onClick={() => setShowRoulette(true)} style={toolbarBtnStyle}>
                🎰 룰렛
              </button>
              <button
                onClick={() => {
                  setShowGuideDialogue(true);
                  setNpcDialogueStep("menu");
                }}
                style={toolbarBtnStyle}
              >
                ?
              </button>
            </div>
          </div>

          <div className="panel__content">
            <div className="shop-balance">
              <span>보유 자산</span>
              <strong>{balance ?? 0} HTO</strong>
            </div>
            {loading ? (
              <div className="loader">로딩 중...</div>
            ) : (
              <div className="shop-grid">
                {items.map((item) => (
                  <div key={item._id} className="shop-item">
                    <div className="shop-item__header">
                      <h3>{item.name}</h3>
                      <span>{item.price} HTO</span>
                    </div>
                    <p className="shop-item__desc">{item.description}</p>
                    <button
                      className="shop-item__btn"
                      onClick={() => handleBuyItem(item._id)}
                      disabled={buyingId === item._id}
                    >
                      {buyingId === item._id ? "구매 중..." : "구매"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 🎒 인벤토리 드로어 */}
        {showInventory && (
          <div className="inv-drawer" onClick={() => setShowInventory(false)}>
            <div className="inv-drawer__overlay"></div>
            <div
              className="inv-drawer__panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="inv-drawer__header">
                <h3>[ INVENTORY ]</h3>
                <button
                  className="inv-drawer__close"
                  onClick={() => setShowInventory(false)}
                >
                  ✕
                </button>
              </div>
              <div className="inv-drawer__content">
                {invLoading ? (
                  <p className="loader">불러오는 중...</p>
                ) : inventory.length > 0 ? (
                  <ul className="inventory-list">
                    {inventory.map((entry) => (
                      <li key={entry._id} className="inventory-item">
                        <span className="inventory-item__name">
                          {entry.item?.name ?? "알 수 없음"}
                        </span>
                        <div className="inventory-item__meta">
                          <span className="inventory-item__date">
                            {new Date(entry.acquiredAt).toLocaleDateString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-state">보유 아이템이 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 🎰 룰렛 */}
        {showRoulette && (
          <div className="roulette-modal">
            <div className="roulette-window">
              <button className="roulette-close" onClick={() => setShowRoulette(false)}>
                ✕
              </button>
              <h2
                style={{
                  color: "var(--bp-accent)",
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "0.2em",
                }}
              >
                [ ROULETTE ]
              </h2>
              <div className="roulette-wheel">
                <div className={`wheel ${spinning ? "spinning" : ""}`}>
                  {[hint1, hint3, exp_boost, rename, random_color, select_color].map(
                    (img, i) => (
                      <div
                        key={i}
                        className="wheel-segment"
                        style={{
                          transform: `rotate(${(360 / 6) * i}deg)`,
                        }}
                      >
                        <img src={img} alt={`item-${i}`} className="roulette-icon" />
                      </div>
                    )
                  )}
                </div>
              </div>
              <button
                className="shop-item__btn"
                onClick={!spinning ? handleSpin : undefined}
                disabled={spinning}
                style={{
                  backgroundColor: "#ff64b4",
                  color: "#fff",
                  marginTop: "16px",
                }}
              >
                {spinning ? "회전 중..." : "룰렛 돌리기 (3 HTO)"}
              </button>
              {result && <p>🎁 결과: {result.name}</p>}
            </div>
          </div>
        )}

        {/* 🐱 NPC 대화창 */}
        {showGuideDialogue && (
          <div
            className="npc-dialogue-overlay"
            onClick={() => setShowGuideDialogue(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <img
              src={mascotImg}
              alt="NPC"
              style={{
                position: "absolute",
                left: "20px",
                bottom: "260px",
                width: "140px",
                height: "140px",
                objectFit: "cover",
                borderRadius: "8px",
                filter: "drop-shadow(0 0 12px rgba(0,255,255,0.6))",
              }}
            />
            <div
              className="npc-dialogue-box"
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.95)",
                padding: 24,
                color: "#fff",
                borderTop: "1px solid var(--bp-accent)",
                boxShadow: "0 -4px 20px rgba(0,255,255,0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {npcDialogueStep === "menu" && (
                <>
                  <p>
                    <strong>안내</strong> — 무엇을 알고 싶으세요?
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button onClick={() => setNpcDialogueStep("coin")} style={npcBtnStyle}>
                      1) 코인 시스템
                    </button>
                    <button onClick={() => setNpcDialogueStep("items")} style={npcBtnStyle}>
                      2) 아이템 사용법
                    </button>
                    <button onClick={() => setNpcDialogueStep("roulette")} style={npcBtnStyle}>
                      3) 룰렛
                    </button>
                    <button onClick={() => setShowGuideDialogue(false)} style={npcBtnStyle}>
                      닫기
                    </button>
                  </div>
                </>
              )}
              {npcDialogueStep === "coin" && (
                <>
                  <p>
                    <strong>코인 시스템</strong>
                    <br />
                    문제를 풀면 코인을 얻고, 상점에서 아이템을 구매할 수 있습니다.
                  </p>
                  <button onClick={() => setNpcDialogueStep("menu")} style={npcBtnStyle}>
                    ← 돌아가기
                  </button>
                </>
              )}
              {npcDialogueStep === "items" && (
                <>
                  <p>
                    <strong>아이템 사용법</strong>
                    <br />
                    인벤토리에서 구매한 아이템을 확인하고 사용할 수 있습니다.
                  </p>
                  <button onClick={() => setNpcDialogueStep("menu")} style={npcBtnStyle}>
                    ← 돌아가기
                  </button>
                </>
              )}
              {npcDialogueStep === "roulette" && (
                <>
                  <p>
                    <strong>룰렛</strong>
                    <br />
                    3코인을 사용하여 랜덤 보상을 획득합니다.
                  </p>
                  <button onClick={() => setNpcDialogueStep("menu")} style={npcBtnStyle}>
                    ← 돌아가기
                  </button>
                </>
              )}
            </div>
          </div>
        )}
=======
      await buyShopItem(itemId);
      toast.success('아이템 구매 성공!');
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || '구매 실패');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <Main title="상점" description="토큰을 사용하여 아이템을 구매하세요.">
      <div className="shop-page">
        <h1 className="shop-title">🎁 상점</h1>
        {loading ? (
          <p>아이템을 불러오는 중...</p>
        ) : (
          <div className="shop-grid">
            {items.map((item) => (
              <ShopItemCard key={item._id} item={item} onBuy={handleBuyItem} />
            ))}
          </div>
        )}
>>>>>>> 8a2f305e38722205d8e16bbbe85f4a4da737d06d
      </div>
    </Main>
  );
};

// === 버튼 스타일 ===
const toolbarBtnStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: "12px",
  border: "1px solid rgba(255,255,255,.25)",
  borderRadius: "6px",
  background: "rgba(255,255,255,0.05)",
  color: "var(--color-gainsboro)",
  cursor: "pointer",
};

const npcBtnStyle: React.CSSProperties = {
  minWidth: 160,
  padding: "6px 12px",
  background: "transparent",
  border: "1px solid var(--bp-accent)",
  borderRadius: 6,
  color: "#fff",
  cursor: "pointer",
};

export default ShopPage;
