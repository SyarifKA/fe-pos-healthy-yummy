'use client';
import { formatCurrency, orderTypeLabel, generateWhatsAppMessage } from '../../lib/constants';
import type { Order } from '../../types';

interface Props { order: Order; onClose: () => void; }

export default function SuccessModal({ order, onClose }: Props) {
  const handleShareWhatsApp = () => {
    const message = generateWhatsAppMessage(order);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="success-screen">
          <span className="success-icon">🎉</span>
          <div style={{ fontFamily: 'var(--font-display, Playfair Display, serif)', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
            Pesanan Berhasil!
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14 }}>
            Simpan kode pesanan Anda untuk tracking
          </div>

          <div className="booking-code">{order.code}</div>

          <div style={{ margin: '14px 0', fontSize: 15 }}>
            Total:{' '}
            <strong style={{ color: 'var(--accent)', fontFamily: 'Playfair Display, serif', fontSize: 18 }}>
              {formatCurrency(order.total)}
            </strong>
          </div>

          {/* Payment Instructions */}
          {order.payment === 'cash' && (
            <div style={{ 
              background: 'var(--amber)', 
              color: 'white', 
              padding: '12px 16px', 
              borderRadius: 12, 
              marginBottom: 16,
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>💵 Pembayaran Cash</div>
              <div style={{ fontSize: 13 }}>Silakan lakukan pembayaran di kasir</div>
            </div>
          )}

          {order.payment === 'qris' && (
            <div style={{ 
              background: 'var(--accent2)', 
              color: 'white', 
              padding: '12px 16px', 
              borderRadius: 12, 
              marginBottom: 16,
              textAlign: 'center'
            }}>
              <img 
                src="/qris.jpeg" 
                alt="QRIS" 
                style={{ width: '300px', height: '300px', marginBottom: '12px', borderRadius: '8px', background: 'white', padding: '8px' }}
              />
              <div style={{ fontWeight: 700, marginBottom: 4 }}>📱 Pembayaran QRIS</div>
              <div style={{ fontSize: 13 }}>Scan QRIS jika anda belum melakukan pembayaran</div>
            </div>
          )}

          {/* Detail */}
          <div style={{
            background: 'var(--surface2)', borderRadius: 12,
            padding: '13px 16px', marginBottom: 22,
            textAlign: 'left', border: '1px solid var(--border)',
          }}>
            {[
              { icon: '👤', val: order.customerName },
              { icon: '📍', val: orderTypeLabel(order.orderType, order.tableNo) },
              { icon: '💳', val: order.payment.toUpperCase() },
              ...(order.notes ? [{ icon: '📝', val: order.notes }] : []),
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, marginBottom: i < 2 ? 6 : 0 }}>
                <span>{r.icon}</span>
                <span>{r.val}</span>
              </div>
            ))}
          </div>

          {/* Share Buttons */}
          <button
            className="btn btn-green"
            style={{ width: '100%', justifyContent: 'center', padding: 14, marginBottom: 12, background: '#25D366' }}
            onClick={handleShareWhatsApp}
          >
            📱 Share ke WhatsApp
          </button>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: 14 }}
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
