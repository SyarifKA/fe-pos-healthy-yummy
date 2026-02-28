'use client';
import { useState } from 'react';
import { useApp } from '@/app/lib/AppContext';
import { formatCurrency } from '../../lib/constants';
import CheckoutModal from './CheckoutModal';

export default function CartPanel() {
  const { cart, updateQty, cartTotal, cartCount } = useApp();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <aside className="cart-panel">
        <div className="cart-head">
          <div className="cart-title">
            🛒 Keranjang {cartCount > 0 && (
              <span style={{
                background: 'var(--accent)', color: 'white',
                borderRadius: 99, padding: '1px 8px',
                fontSize: 12, fontWeight: 800, marginLeft: 6,
              }}>{cartCount}</span>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>Keranjang kosong</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>
              Klik menu untuk menambahkan
            </div>
          </div>
        ) : (
          <>
            <div className="cart-body">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="ci-em">{item.emoji}</div>
                  <div className="ci-info">
                    <div className="ci-name">{item.name}</div>
                    <div className="ci-price">{formatCurrency(item.price * item.qty)}</div>
                  </div>
                  <div className="ci-qty">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                    <span className="qty-n">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-foot">
              <div className="divider" />
              <div className="cart-total-row">
                <span className="cart-total-lbl">Total Pembayaran</span>
                <span className="cart-total-val">{formatCurrency(cartTotal)}</span>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
                onClick={() => setCheckoutOpen(true)}
              >
                Checkout →
              </button>
            </div>
          </>
        )}
      </aside>

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </>
  );
}
