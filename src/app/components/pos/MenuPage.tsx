'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApp } from '../../lib/AppContext';
import { ADS, formatCurrency } from '../../lib/constants';
import type { Category, MenuItem } from '../../types';
import CheckoutModal from './CheckoutModal';
import ProductDetailModal from './ProductDetailModal';

function MenuImage({ item }: { item: MenuItem }) {
  const [imgError, setImgError] = useState(false);
  if (!item.image || imgError) {
    return (
      <div className="menu-img-placeholder">
        <span className="menu-img-emoji">{item.emoji}</span>
      </div>
    );
  }
  return (
    <Image 
      src={item.image}
      alt={item.name}
      fill
      sizes="120px"
      className="menu-img"
      onError={() => setImgError(true)}
    />
  );
}

function MenuCard({ item, qty, onAdd, onShowDetail }: {
  item: MenuItem; qty: number; onAdd: () => void; onShowDetail: () => void;
}) {
  const isUnavailable = item.isAvailable === false || item.stock === 0;
  return (
    <div className={`menu-card2 ${isUnavailable ? 'unavailable' : ''}`}>
      <div className="menu-card2-img" onClick={onShowDetail}>
        <MenuImage item={item} />
        {isUnavailable && (
          <div className="menu-unavail-overlay">
            <span>❌ Stok Habis</span>
          </div>
        )}
      </div>
      <div className="menu-card2-body" onClick={!isUnavailable ? onAdd : undefined}>
        <div className="menu-card2-name">{item.name}</div>
        <div className="menu-card2-price">{formatCurrency(item.price)}</div>
      </div>
      {qty > 0 ? (
        <div className="menu-qty-control" onClick={(e) => e.stopPropagation()}>
          <button className="qty-btn" onClick={onShowDetail}>−</button>
          <span className="qty-num">{qty}</span>
          <button className="qty-btn" onClick={onAdd}>+</button>
        </div>
      ) : !isUnavailable && (
        <div className="menu-card2-actions" onClick={(e) => e.stopPropagation()}>
          <button className="menu-add-btn" onClick={onAdd}>+ Tambah</button>
          <button className="menu-detail-btn" onClick={onShowDetail}>ℹ️ Detail</button>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  const router = useRouter();
  const { addToCart, updateQty, cart, menuItems, orderType, selectedMemberId, customerName, selectedMember } = useApp();
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [adIdx, setAdIdx] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<MenuItem | null>(null);

  // Redirect if order type not selected
  useEffect(() => {
    if (!orderType) {
      router.push('/pos/order-type');
    }
  }, [orderType, router]);

  useEffect(() => {
    const t = setInterval(() => setAdIdx(i => (i + 1) % ADS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const filtered = menuItems.filter(i =>
    (category === 'all' || i.category === category) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const getQty = useCallback((id: number) => cart.find(c => c.id === id)?.qty ?? 0, [cart]);
  const cartTotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const foodItems  = filtered.filter(i => i.category === 'food');
  const drinkItems = filtered.filter(i => i.category === 'drink');
  const ad = ADS[adIdx];

  // Get order type display
  const orderTypeDisplay = orderType === 'pickup' ? '📦 Pickup' : orderType === 'dine-in' ? '🍽️ Dine In' : orderType === 'takeaway' ? '🛵 Takeaway' : '';
  const memberDisplay = selectedMemberId ? `👤 ${selectedMember?.name || customerName}` : '😐 Tamu';

  return (
    <>
      {/* Order Info Bar */}
      <div className="order-info-bar">
        <div className="order-info-item" onClick={() => router.push('/pos/order-type')}>
          <span className="order-info-icon">{orderType === 'pickup' ? '' : orderType === 'dine-in' ? '' : orderType === 'takeaway' ? '' : ''}</span>
          <span className="order-info-text">{orderTypeDisplay}</span>
          <span className="order-info-edit">✏️</span>
        </div>
        <div className="order-info-divider" />
        <div className="order-info-item" onClick={() => router.push('/pos/member')}>
          <span className="order-info-icon">{selectedMemberId ? '' : ''}</span>
          <span className="order-info-text">{memberDisplay}</span>
          <span className="order-info-edit">✏️</span>
        </div>
      </div>

      <div className="topbar">
        <div className="topbar-title">🍽️ Menu Hari Ini</div>
        <div className="topbar-right">
          <div className="search-wrap">
            <input className="search-input" placeholder="Cari menu…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {cartCount > 0 && (
            <button className="mobile-cart-fab" onClick={() => setCheckoutOpen(true)}>
              🛒 {cartCount} · {formatCurrency(cartTotal)}
            </button>
          )}
        </div>
      </div>

      <div className="page-content">
        {/* Ad Banner */}
        <div className="ad-banner" style={{ background: ad.gradient }}>
          <div className="ad-content">
            <div className="ad-title">{ad.title}</div>
            <div className="ad-text">{ad.text}</div>
          </div>
          <div className="ad-chip">PROMO</div>
        </div>

        {/* Filters */}
        <div className="filter-tabs">
          {(['all', 'food', 'drink'] as Category[]).map(c => (
            <button
              key={c}
              className={`filter-tab ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c === 'all' ? '🍽️ Semua' : c === 'food' ? '🥘 Makanan' : '🥤 Minuman'}
            </button>
          ))}
        </div>

        {/* Food Section */}
        {foodItems.length > 0 && (
          <div className="menu-section">
            <div className="menu-section-title">🥘 Makanan</div>
            <div className="menu-grid2">
              {foodItems.map(item => (
                <MenuCard
                  key={item.id}
                  item={item}
                  qty={getQty(item.id)}
                  onAdd={() => addToCart(item)}
                  onShowDetail={() => setDetailModalItem(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Drink Section */}
        {drinkItems.length > 0 && (
          <div className="menu-section">
            <div className="menu-section-title">🥤 Minuman</div>
            <div className="menu-grid2">
              {drinkItems.map(item => (
                <MenuCard
                  key={item.id}
                  item={item}
                  qty={getQty(item.id)}
                  onAdd={() => addToCart(item)}
                  onShowDetail={() => setDetailModalItem(item)}
                />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Menu tidak ditemukan</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Coba kata kunci lain</div>
          </div>
        )}
      </div>

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
      {detailModalItem && (
        <ProductDetailModal 
          item={detailModalItem} 
          onClose={() => setDetailModalItem(null)} 
          onAddToCart={() => {
            addToCart(detailModalItem);
            setDetailModalItem(null);
          }} 
        />
      )}
    </>
  );
}
