import React, { useEffect, useState } from 'react';
import { getShopItems, buyShopItem, getInventory } from '../../api/axiosShop';
import { getUserDetail } from '../../api/axiosUser';
import { ShopItem } from '../../types/ShopItem';
import '../../assets/scss/Shop/ShopPage.scss';
import Main from '../../components/main/Main';
import { toast } from 'react-toastify';

// 🐱 고양이 이미지 import
import mascotImg from '../../assets/img/icon/Hack cat.png';

type InventoryEntry = {
  _id: string;
  item: ShopItem | null;
  isUsed: boolean;
  acquiredAt: string;
};

const ShopPage: React.FC = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [invLoading, setInvLoading] = useState(true);

  // NPC 대화창 상태
  const [showGuideDialogue, setShowGuideDialogue] = useState(false);
  const [npcDialogueStep, setNpcDialogueStep] = useState<'menu' | 'coin' | 'items' | 'roulette'>('menu');

  const fetchAll = async () => {
    setLoading(true);
    setInvLoading(true);
    try {
      const [itemsData, me, invData] = await Promise.all([
        getShopItems(),
        getUserDetail(),
        getInventory(),
      ]);
      setItems(Array.isArray(itemsData) ? itemsData : []);
      const coin = typeof me?.user?.htoCoin === 'number' ? me.user.htoCoin : 0;
      setBalance(coin);
      setInventory(Array.isArray(invData) ? invData : []);
    } catch (e) {
      alert('상점 아이템/잔액/인벤토리 불러오기 실패');
      console.error('fetchAll error', e);
    } finally {
      setLoading(false);
      setInvLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleBuyItem = async (itemId: string) => {
    if (buyingId) return;
    try {
      setBuyingId(itemId);
      const msg = await buyShopItem(itemId);
      toast.success(msg || '아이템 구매 성공!');
      await fetchAll();
    } catch (err: any) {
      const msg = err?.response?.data?.msg || err?.message || '구매 실패';
      if (msg === 'lacked Coin.' || msg.includes('코인')) {
        alert('코인이 부족합니다.');
      } else {
        alert(msg);
      }
    } finally {
      setBuyingId(null);
    }
  };

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGuideDialogue(false);
        setNpcDialogueStep('menu');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Main>
      <div className="shop-layout--blueprint">
        {/* ─ Left: Shop Panel ─ */}
        <section className="panel--blueprint">
          <div
            className="panel__header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <h1 className="panel__title">SHOP TERMINAL</h1>

            <div className="cy-toolbar">
              <label
                htmlFor="shop-sort"
                style={{
                  color: 'var(--color-gainsboro)',
                  fontSize: 12,
                  opacity: 0.9,
                }}
              >
                정렬
              </label>
              <select
                id="shop-sort"
                className="cy-select"
                defaultValue={
                  (typeof window !== 'undefined'
                    ? new URLSearchParams(window.location.search).get('sort')
                    : null) || 'price-asc'
                }
                onChange={(e) => {
                  const v = e.target.value as
                    | 'price-asc'
                    | 'price-desc'
                    | 'name-asc';
                  const url = new URL(window.location.href);
                  url.searchParams.set('sort', v);
                  window.history.replaceState({}, '', url.toString());
                  setItems((prev) => {
                    const next = [...prev];
                    switch (v) {
                      case 'price-desc':
                        return next.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
                      case 'name-asc':
                        return next.sort((a, b) =>
                          (a.name || '').localeCompare(b.name || '')
                        );
                      case 'price-asc':
                      default:
                        return next.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
                    }
                  });
                }}
              >
                <option value="price-asc">가격 낮은순</option>
                <option value="price-desc">가격 높은순</option>
                <option value="name-asc">이름 오름차순</option>
              </select>

              {/* 인벤토리 버튼 */}
              <a
                href="#inv"
                className="cy-button--accent"
                style={{
                  marginLeft: 8,
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--bp-accent)',
                  background: 'transparent',
                  color: 'var(--color-gainsboro)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                인벤토리
              </a>

              {/* ? 버튼 → NPC 대화창 열기 */}
              <button
                type="button"
                onClick={() => {
                  setShowGuideDialogue(true);
                  setNpcDialogueStep('menu');
                }}
                className="cy-button--accent"
                style={{
                  marginLeft: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--bp-accent)',
                  background: 'transparent',
                  color: 'var(--color-gainsboro)',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
              >
                ?
              </button>
            </div>
          </div>

          <div className="panel__content">
            <div className="shop-balance">
              <span> 보유 자산 </span>
              <strong>{balance === null ? '...' : `${balance} HTO`}</strong>
            </div>

            {loading && <div className="loader">데이터베이스 접속 중...</div>}

            {!loading && items.length === 0 && (
              <div className="empty-state">판매 가능한 아이템이 없습니다.</div>
            )}

            {!loading && items.length > 0 && (
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
                      {buyingId === item._id ? '처리 중...' : '아이템 획득'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─ Inventory Drawer ─ */}
        <div id="inv" className="inv-drawer" role="dialog" aria-modal="true">
          <a href="#" className="inv-drawer__overlay" aria-label="닫기" />
          <div className="inv-drawer__panel" onClick={(e) => e.stopPropagation()}>
            <div className="inv-drawer__header">
              <h2 className="panel__title">INVENTORY LOG</h2>
              <a href="#" className="inv-drawer__close" aria-label="닫기">
                ✕
              </a>
            </div>
            <div className="inv-drawer__content">
              {invLoading ? (
                <div className="loader">인벤토리 스캔 중...</div>
              ) : inventory.length === 0 ? (
                <div className="empty-state">보유한 아이템이 없습니다.</div>
              ) : (
                <ul className="inventory-list">
                  {inventory.map((e) => {
                    const name = e.item?.name ?? '[알 수 없는 아이템]';
                    return (
                      <li key={e._id} className="inventory-item">
                        <span className="inventory-item__name">{name}</span>
                        <div className="inventory-item__meta">
                          {e.isUsed && <span className="badge--used">사용됨</span>}
                          <span className="inventory-item__date">
                            {new Date(e.acquiredAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ─ Guide Dialogue ─ */}
        {showGuideDialogue && (
          <div
            role="dialog"
            aria-modal="true"
            onClick={() => {
              setShowGuideDialogue(false);
              setNpcDialogueStep('menu');
            }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              padding: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                pointerEvents: 'none',
              }}
            >
              {/* NPC 이미지 */}
              <div
                style={{
                  alignSelf: 'flex-start',
                  marginLeft: 16,
                  marginBottom: 8,
                  pointerEvents: 'auto',
                }}
              >
                <img
                  src={mascotImg}
                  alt="마스코트 고양이"
                  style={{
                    width: 160,
                    height: 180,
                    borderRadius: 10,
                    objectFit: 'cover',
                    background: '#222',
                    animation: 'flicker 2.5s infinite',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* 대화창 본체 */}
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.95)',
                  padding: '24px 20px',
                  color: '#fff',
                  boxShadow: '0 -6px 30px rgba(0,0,0,0.6)',
                  textAlign: 'left',
                  pointerEvents: 'auto',
                }}
              >
                {npcDialogueStep === 'menu' && (
                  <>
                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>
                      <strong>안내</strong> — 무엇을 알고 싶으세요?
                    </p>
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button 
                        onClick={() => setNpcDialogueStep('coin')} 
                        style={{ alignSelf: 'flex-start', minWidth: '140px', padding: '6px 12px', background: 'transparent', border: '1px solid var(--bp-accent)', color: '#fff', cursor: 'pointer' }}
                      >
                        1) 코인 시스템
                      </button>
                      <button 
                        onClick={() => setNpcDialogueStep('items')} 
                        style={{ alignSelf: 'flex-start', minWidth: '140px', padding: '6px 12px', background: 'transparent', border: '1px solid var(--bp-accent)', color: '#fff', cursor: 'pointer' }}
                      >
                        2) 아이템 사용법
                      </button>
                      <button 
                        onClick={() => setNpcDialogueStep('roulette')} 
                        style={{ alignSelf: 'flex-start', minWidth: '140px', padding: '6px 12px', background: 'transparent', border: '1px solid var(--bp-accent)', color: '#fff', cursor: 'pointer' }}
                      >
                        3) 룰렛
                      </button>
                      <button 
                        onClick={() => { setShowGuideDialogue(false); setNpcDialogueStep('menu'); }} 
                        style={{ alignSelf: 'flex-start', minWidth: '140px', padding: '6px 12px', background: 'transparent', border: '1px solid var(--bp-accent)', color: '#fff', cursor: 'pointer' }}
                      >
                        닫기
                      </button>
                    </div>
                  </>
                )}

                {npcDialogueStep === 'coin' && (
                  <>
                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>
                      <strong>코인 시스템</strong><br />
                      문제를 풀면 코인을 얻고, 승리 시 더 많은 보상을 받아요.<br />
                      이 코인은 상점에서 다양한 아이템 구매에 쓰입니다.
                    </p>
                    <button onClick={() => setNpcDialogueStep('menu')}
                      style={{ alignSelf: 'flex-start', minWidth: '140px', padding: '6px 12px', marginTop: 12, background: 'transparent', border: '1px solid var(--bp-accent)', color: '#fff', cursor: 'pointer' }}>
                      ← 돌아가기
                    </button>
                  </>
                )}

                {npcDialogueStep === 'items' && (
                  <>
                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>
                      <strong>아이템 사용법</strong><br />
                      인벤토리에서 구매한 아이템을 확인할 수 있어요.<br />
                      일부 아이템은 자동 적용되며, 일부는 직접 사용해야 합니다.
                    </p>
                    <button onClick={() => setNpcDialogueStep('menu')}
                      style={{ alignSelf: 'flex-start', minWidth: '140px', padding: '6px 12px', marginTop: 12, background: 'transparent', border: '1px solid var(--bp-accent)', color: '#fff', cursor: 'pointer' }}>
                      ← 돌아가기
                    </button>
                  </>
                )}

                {npcDialogueStep === 'roulette' && (
                  <>
                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>
                      <strong>룰렛</strong><br />
                      소액 코인을 소모해 랜덤 보상을 얻는 기능이에요.<br />
                      확률은 공개되어 있으며, 다양한 희귀 아이템을 얻을 수 있습니다!
                    </p>
                    <button onClick={() => setNpcDialogueStep('menu')}
                      style={{ alignSelf: 'flex-start', minWidth: '140px', padding: '6px 12px', marginTop: 12, background: 'transparent', border: '1px solid var(--bp-accent)', color: '#fff', cursor: 'pointer' }}>
                      ← 돌아가기
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 애니메이션 정의 */}
      <style>
        {`
          @keyframes flicker {
            0%   { opacity: 1; }
            45%  { opacity: 0.85; }
            50%  { opacity: 0.4; }
            55%  { opacity: 0.85; }
            60%  { opacity: 0.95; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Main>
  );
};

export default ShopPage;
