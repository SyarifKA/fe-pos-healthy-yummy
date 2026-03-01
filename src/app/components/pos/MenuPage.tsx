// 'use client';
// import { useState, useEffect } from 'react';
// import { useApp } from '../../lib/AppContext';
// import { MENU_ITEMS, ADS, formatCurrency } from '../../lib/constants';
// import type { Category } from '../../types';
// import CheckoutModal from './CheckoutModal';
// import RegistrationModal from './RegistrationModal';

// export default function MenuPage() {
//   const { addToCart, cart } = useApp();
//   const [category, setCategory] = useState<Category>('all');
//   const [search, setSearch] = useState('');
//   const [adIdx, setAdIdx] = useState(0);
//   const [checkoutOpen, setCheckoutOpen] = useState(false);
//   const [regOpen, setRegOpen] = useState(false);

//   useEffect(() => {
//     const t = setInterval(() => setAdIdx(i => (i + 1) % ADS.length), 5000);
//     return () => clearInterval(t);
//   }, []);

//   const filtered = MENU_ITEMS.filter(i =>
//     (category === 'all' || i.category === category) &&
//     i.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const ad = ADS[adIdx];
//   const cartCount = cart.reduce((s, x) => s + x.qty, 0);

//   return (
//     <>
//       {/* Topbar */}
//       <div className="topbar">
//         <div className="topbar-title">🍽️ Menu Order</div>
//         <div className="topbar-right">
//           <div className="search-wrap">
//             <input
//               className="search-input"
//               placeholder="Cari menu…"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//             />
//           </div>
//           <button className="btn btn-ghost btn-sm" onClick={() => setRegOpen(true)}>
//             👤 Daftar Member
//           </button>
//           {/* Mobile cart button */}
//           <button
//             className="btn btn-primary btn-sm"
//             style={{ display: 'none' }}
//             id="mobile-cart-btn"
//             onClick={() => setCheckoutOpen(true)}
//           >
//             🛒 {cartCount > 0 ? cartCount : ''}
//           </button>
//         </div>
//       </div>

//       <div className="page-content">
//         {/* Ad Banner */}
//         <div className="ad-banner" style={{ background: ad.gradient }}>
//           <div className="ad-content">
//             <div className="ad-title">{ad.title}</div>
//             <div className="ad-text">{ad.text}</div>
//           </div>
//           <div className="ad-chip">PROMO</div>
//         </div>

//         {/* Filters */}
//         <div className="filter-tabs">
//           {(['all', 'food', 'drink'] as Category[]).map(c => (
//             <button
//               key={c}
//               className={`filter-tab ${category === c ? 'active' : ''}`}
//               onClick={() => setCategory(c)}
//             >
//               {c === 'all' ? '🍽️ Semua' : c === 'food' ? '🥘 Makanan' : '🥤 Minuman'}
//             </button>
//           ))}
//           <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)', alignSelf: 'center' }}>
//             {filtered.length} menu
//           </span>
//         </div>

//         {/* Menu Grid */}
//         <div className="menu-grid">
//           {filtered.map(item => {
//             const inCart = cart.find(c => c.id === item.id);
//             return (
//               <div
//                 key={item.id}
//                 className={`menu-card ${inCart ? 'in-cart' : ''}`}
//                 onClick={() => addToCart(item)}
//               >
//                 {inCart && <div className="menu-qty-badge">{inCart.qty}</div>}
//                 <span className="menu-emoji">{item.emoji}</span>
//                 <div className="menu-name" style={{color: 'var(--text)'}}>{item.name}</div>
//                 <div className="menu-desc">{item.desc}</div>
//                 <div className="menu-price">{formatCurrency(item.price)}</div>
//               </div>
//             );
//           })}
//         </div>

//         {filtered.length === 0 && (
//           <div className="empty-state">
//             <div className="empty-state-icon">🔍</div>
//             <div style={{ fontSize: 15, fontWeight: 700 }}>Menu tidak ditemukan</div>
//             <div style={{ fontSize: 13, marginTop: 4 }}>Coba kata kunci lain</div>
//           </div>
//         )}
//       </div>

//       {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
//       {regOpen && <RegistrationModal onClose={() => setRegOpen(false)} />}
//     </>
//   );
// }

'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useApp } from '../../lib/AppContext';
import { ADS, formatCurrency } from '../../lib/constants';
import type { Category, MenuItem } from '../../types';
import CheckoutModal from './CheckoutModal';
import RegistrationModal from './RegistrationModal';
import ProductDetailModal from './ProductDetailModal';

const TAG_CONFIG: Record<string, { label: string; style: string }> = {
  bestseller: { label: '⭐ Terlaris', style: 'tag-bestseller' },
  new:        { label: '🆕 Baru',     style: 'tag-new'        },
  spicy:      { label: '🌶️ Pedas',   style: 'tag-spicy'      },
  vegetarian: { label: '🌿 Veg',      style: 'tag-veg'        },
  healthy:    { label: '💪 Sehat',    style: 'tag-healthy'    },
};

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
    <div className="menu-img-wrap">
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes="(max-width: 768px) 50vw, 200px"
        className="menu-img"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

function MenuCard({ item, qty, onAdd, onRemove, onShowDetail }: {
  item: MenuItem; qty: number; onAdd: () => void; onRemove: () => void; onShowDetail: () => void;
}) {
  const primaryTag = item.tags?.[0];
  const tagCfg = primaryTag ? TAG_CONFIG[primaryTag] : null;
  const isUnavailable = item.isAvailable === false;

  return (
    <div
      className={`menu-card2${qty > 0 ? ' in-cart2' : ''}${isUnavailable ? ' unavailable' : ''}`}
      onClick={() => !isUnavailable && onAdd()}
    >
      <div className="menu-photo-area">
        <MenuImage item={item} />
        {tagCfg && <div className={`menu-tag-badge ${tagCfg.style}`}>{tagCfg.label}</div>}
        {qty > 0 && (
          <div className="menu-qty-overlay">
            <button className="qty-ctrl-btn" onClick={e => { e.stopPropagation(); onRemove(); }}>−</button>
            <span className="qty-ctrl-num">{qty}</span>
            <button className="qty-ctrl-btn" onClick={e => { e.stopPropagation(); onAdd(); }}>+</button>
          </div>
        )}
        {isUnavailable && <div className="menu-unavail-overlay"><span>Habis</span></div>}
      </div>

      <div className="menu-card2-body">
        <div className="menu-card2-name">{item.name}</div>
        <div className="menu-card2-desc">{item.desc}</div>
        <div className="menu-card2-footer">
          <div className="menu-card2-price">{formatCurrency(item.price)}</div>
          {item.calories !== undefined && item.calories > 0 && (
            <div className="menu-calories">🔥 {item.calories} kal</div>
          )}
        </div>
        {item.tags && item.tags.length > 1 && (
          <div className="menu-tags-row">
            {item.tags.slice(1).map(t => (
              <span key={t} className={`menu-tag-sm ${TAG_CONFIG[t]?.style ?? ''}`}>
                {TAG_CONFIG[t]?.label ?? t}
              </span>
            ))}
          </div>
        )}
        {qty === 0 && !isUnavailable && (
          <div className="menu-card2-actions">
            <button className="menu-add-btn" onClick={e => { e.stopPropagation(); onAdd(); }}>
              + Tambah
            </button>
            <button className="menu-detail-btn" onClick={e => { e.stopPropagation(); onShowDetail(); }}>
              ℹ️ Detail
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { addToCart, updateQty, cart, menuItems } = useApp();
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [adIdx, setAdIdx] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<MenuItem | null>(null);

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

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">🍽️ Menu Hari Ini</div>
        <div className="topbar-right">
          <div className="search-wrap">
            <input className="search-input" placeholder="Cari menu…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setRegOpen(true)}>👤 Daftar Member</button>
          {cartCount > 0 && (
            <button className="mobile-cart-fab" onClick={() => setCheckoutOpen(true)}>
              🛒 {cartCount} · {formatCurrency(cartTotal)}
            </button>
          )}
        </div>
      </div>

      <div className="page-content">
        {/* Ad Banner */}
        <div style={{ marginBottom: 20 }}>
          <div className="ad-banner" style={{ background: ad.gradient, cursor: 'pointer' }}
            onClick={() => setAdIdx(i => (i + 1) % ADS.length)}>
            <div className="ad-content">
              <div className="ad-title">{ad.title}</div>
              <div className="ad-text">{ad.text}</div>
            </div>
            <div className="ad-chip">PROMO</div>
          </div>
          <div className="ad-dots">
            {ADS.map((_, i) => (
              <button key={i} className={`ad-dot${i === adIdx ? ' active' : ''}`} onClick={() => setAdIdx(i)} />
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          <div className="filter-tabs" style={{ marginBottom: 0 }}>
            {(['all', 'food', 'drink'] as Category[]).map(c => (
              <button key={c} className={`filter-tab${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>
                {c === 'all' ? '🍽️ Semua' : c === 'food' ? '🥘 Makanan' : '🥤 Minuman'}
              </button>
            ))}
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
            {filtered.length} menu
          </span>
        </div>

        {/* Tag legend */}
        <div className="tag-legend">
          {Object.entries(TAG_CONFIG).map(([k, v]) => (
            <span key={k} className={`menu-tag-sm ${v.style}`}>{v.label}</span>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Menu tidak ditemukan</div>
            <div style={{ fontSize: 13, marginTop: 4, color: 'var(--text2)' }}>Coba kata kunci lain</div>
          </div>
        ) : category === 'all' ? (
          <>
            {foodItems.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <div className="menu-section-title">🥘 Makanan</div>
                <div className="menu-grid2">
                  {foodItems.map(item => <MenuCard key={item.id} item={item} qty={getQty(item.id)} onAdd={() => addToCart(item)} onRemove={() => updateQty(item.id, -1)} onShowDetail={() => setDetailModalItem(item)} />)}
                </div>
              </section>
            )}
            {drinkItems.length > 0 && (
              <section>
                <div className="menu-section-title">🥤 Minuman</div>
                <div className="menu-grid2">
                  {drinkItems.map(item => <MenuCard key={item.id} item={item} qty={getQty(item.id)} onAdd={() => addToCart(item)} onRemove={() => updateQty(item.id, -1)} onShowDetail={() => setDetailModalItem(item)} />)}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="menu-grid2">
            {filtered.map(item => <MenuCard key={item.id} item={item} qty={getQty(item.id)} onAdd={() => addToCart(item)} onRemove={() => updateQty(item.id, -1)} onShowDetail={() => setDetailModalItem(item)} />)}
          </div>
        )}

        {/* Bottom Ad Banner - Sticky at Bottom */}
        <div className="bottom-ad-banner sticky-bottom">
          <a href="https://www.telkomsel.com/" target="_blank" rel="noopener noreferrer" className="bottom-ad-link">
            <div className="bottom-ad-bg"></div>
            <div className="bottom-ad-overlay">
              <span className="bottom-ad-label">IKLAN</span>
              <span className="bottom-ad-text">Promo Spesial dari Telkomsel!</span>
            </div>
          </a>
        </div>
      </div>

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
      {regOpen && <RegistrationModal onClose={() => setRegOpen(false)} />}
      {detailModalItem && <ProductDetailModal item={detailModalItem} onClose={() => setDetailModalItem(null)} onAddToCart={() => { addToCart(detailModalItem); setDetailModalItem(null); }} />}
    </>
  );
}
