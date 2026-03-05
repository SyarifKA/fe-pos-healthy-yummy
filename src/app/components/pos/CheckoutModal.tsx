'use client';
import { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { formatCurrency, orderTypeLabel } from '../../lib/constants';
import type { PaymentMethod, Order } from '../../types';
import SuccessModal from './SuccessModal';

interface Props { onClose: () => void; }

export default function CheckoutModal({ onClose }: Props) {
  const { 
    cart, cartTotal, members, tableCount, placeOrder, clearCart, addMember,
    orderType, selectedMemberId, guestName, guestPhone, selectedMember, customerName, resetOrderFlow
  } = useApp();

  const [payment, setPayment] = useState<PaymentMethod | ''>('');
  const [notes, setNotes] = useState('');
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  const ok = payment !== '';

  const handlePlace = () => {
    if (!payment || !orderType) return;
    
    const order = placeOrder({
      customerName,
      memberId: selectedMemberId,
      orderType,
      tableNo: orderType === 'dine-in' ? 1 : null,
      payment: payment as PaymentMethod,
      notes,
    });
    setSuccessOrder(order);
  };

  if (successOrder) {
    return <SuccessModal order={successOrder} onClose={onClose} />;
  }

  const orderTypeDisplay = orderType === 'pickup' ? '📦 Pickup' : orderType === 'dine-in' ? '🍽️ Dine In' : orderType === 'takeaway' ? '🛵 Takeaway' : '';

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        {/* Header */}
        <div className="modal-head">
          <div className="modal-title">💳 Pembayaran</div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Order Info Summary */}
          <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: 14, border: '1px solid var(--border)', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text2)', fontSize: 13 }}>Pemesan</span>
              <strong style={{ fontSize: 13 }}>{customerName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text2)', fontSize: 13 }}>Tipe Pemesanan</span>
              <strong style={{ fontSize: 13 }}>{orderTypeDisplay}</strong>
            </div>
          </div>

          {/* Payment Method */}
          <div className="form-group">
            <label className="form-label">Metode Pembayaran</label>
            <div className="sel-grid">
              {([
                { val: 'cash'     as PaymentMethod, icon: '💵', label: 'Cash' },
                { val: 'debit'    as PaymentMethod, icon: '💳', label: 'Debit / ATM' },
                { val: 'transfer' as PaymentMethod, icon: '📲', label: 'Transfer Bank' },
                { val: 'qris'     as PaymentMethod, icon: '📱', label: 'QRIS' },
              ]).map(p => (
                <div
                  key={p.val}
                  className={`sel-card ${payment === p.val ? 'sel-active' : ''}`}
                  onClick={() => setPayment(p.val)}
                >
                  <span className="sel-icon">{p.icon}</span>
                  {p.label}
                </div>
              ))}
            </div>
          </div>

          {payment === 'qris' && (
            <div className="qris-box">
              <img 
                src="/qris.jpeg" 
                alt="QRIS Payment" 
                style={{ width: '100%', maxWidth: '300px', height: 'auto', objectFit: 'contain', borderRadius: '8px' }}
              />
              <div className="qris-label">Scan QRIS untuk Membayar</div>
              <div className="qris-sub">Healthy Yummy · {formatCurrency(cartTotal)}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 8 }}>
                Atau tunjukkan kode pesanan ke kasir untuk scan QRIS
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Catatan (opsional)</label>
            <input
              className="form-input"
              placeholder="Contoh: tidak pedas, tanpa bawang…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Cart Summary */}
          <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
            <div className="form-label" style={{ marginBottom: 10 }}>Ringkasan Pesanan</div>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                <span>{item.emoji} {item.name} ×{item.qty}</span>
                <span style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="divider" style={{ margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800 }}>Total</span>
              <span className="cart-total-val">{formatCurrency(cartTotal)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          <button className="btn btn-green" disabled={!ok} onClick={handlePlace}>✓ Konfirmasi</button>
        </div>
      </div>
    </div>
  );
}
