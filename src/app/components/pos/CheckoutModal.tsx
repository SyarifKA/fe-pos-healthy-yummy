'use client';
import { useState } from 'react';
import { useApp } from '../../lib/AppContext';
import { formatCurrency, orderTypeLabel } from '../../lib/constants';
import type { OrderType, PaymentMethod, Order } from '../../types';
import SuccessModal from './SuccessModal';

interface Props { onClose: () => void; }

type Step = 1 | 2 | 3;

export default function CheckoutModal({ onClose }: Props) {
  const { cart, cartTotal, members, tableCount, placeOrder, clearCart, addMember } = useApp();

  const [step, setStep] = useState<Step>(1);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number | ''>('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [registerAsMember, setRegisterAsMember] = useState(false);
  const [orderType, setOrderType] = useState<OrderType | ''>('');
  const [tableNo, setTableNo] = useState<number | null>(null);
  const [payment, setPayment] = useState<PaymentMethod | ''>('');
  const [notes, setNotes] = useState('');
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  const selectedMember = members.find(m => m.id === selectedMemberId);

  const ok1 = isMember === false ? guestName.trim().length > 0 && guestPhone.trim().length > 0 : !!selectedMember;
  const ok2 = orderType !== '' && (orderType !== 'dine-in' || tableNo !== null);
  const ok3 = payment !== '';

  const next = () => setStep(s => (s + 1) as Step);
  const back = () => setStep(s => (s - 1) as Step);

  const handlePlace = () => {
    if (!orderType || !payment) return;
    
    // Register as member if opted in
    if (registerAsMember && guestName && guestPhone) {
      addMember({
        name: guestName,
        phone: guestPhone,
        address: '',
        socmed: '',
      });
    }
    
    const order = placeOrder({
      customerName: isMember && selectedMember ? selectedMember.name : guestName,
      memberId: registerAsMember ? (members.length + 1) : (selectedMember?.id ?? null),
      orderType: orderType as OrderType,
      tableNo,
      payment: payment as PaymentMethod,
      notes,
    });
    clearCart();
    setSuccessOrder(order);
  };

  if (successOrder) {
    return <SuccessModal order={successOrder} onClose={onClose} />;
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        {/* Header */}
        <div className="modal-head">
          <div className="modal-title">
            {step === 1 ? '👤 Data Pemesan' : step === 2 ? '🛵 Tipe Pemesanan' : '💳 Pembayaran'}
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        {/* Step bar */}
        <div className="step-bar">
          {([1,2,3] as Step[]).map(s => (
            <div key={s} className={`step-seg ${s <= step ? 'done' : ''}`} />
          ))}
        </div>

        <div className="modal-body">

          {/* ── STEP 1: Customer ── */}
          {step === 1 && (
            <>
              <div className="sel-grid">
                {[
                  { val: true,  icon: '🪪', label: 'Pelanggan Member' },
                  { val: false, icon: '👤', label: 'Tamu / Non-Member' },
                ].map(o => (
                  <div
                    key={String(o.val)}
                    className={`sel-card ${isMember === o.val ? 'sel-active' : ''}`}
                    onClick={() => setIsMember(o.val)}
                  >
                    <span className="sel-icon">{o.icon}</span>
                    {o.label}
                  </div>
                ))}
              </div>

              {isMember === true && (
                <div className="form-group">
                  <label className="form-label">Pilih Member</label>
                  <select
                    className="form-select"
                    value={selectedMemberId}
                    onChange={e => setSelectedMemberId(Number(e.target.value) || '')}
                  >
                    <option value="">-- Pilih member --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} · {m.phone}</option>
                    ))}
                  </select>
                  {selectedMember && (
                    <div className="member-card" style={{ marginTop: 8 }}>
                      <div className="member-avatar">{selectedMember.name[0].toUpperCase()}</div>
                      <div>
                        <div className="member-name">{selectedMember.name}</div>
                        <div className="member-detail">{selectedMember.phone} · {selectedMember.socmed}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isMember === false && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nama Pemesan *</label>
                    <input
                      className="form-input"
                      placeholder="Masukkan nama pemesan"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Nomor WhatsApp *</label>
                    <input
                      className="form-input"
                      placeholder="Contoh: 081234567890"
                      value={guestPhone}
                      onChange={e => setGuestPhone(e.target.value)}
                    />
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>
                      Untuk pengiriman struk dan kode pesanan
                    </div>
                  </div>

                  <div 
                    className="member-register-option"
                    onClick={() => setRegisterAsMember(!registerAsMember)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      border: registerAsMember ? '2px solid var(--accent)' : '2px solid var(--border)',
                      borderRadius: 12,
                      cursor: 'pointer',
                      marginTop: 8
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={registerAsMember} 
                      onChange={() => setRegisterAsMember(!registerAsMember)}
                      style={{ width: 18, height: 18 }}
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>Daftar jadi Member</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>Dapatkan diskon 10% untuk setiap order</div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── STEP 2: Order type ── */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label className="form-label">Tipe Pemesanan</label>
                <div className="sel-grid sel-grid3">
                  {([
                    { val: 'pickup'   as OrderType, icon: '🛵', label: 'Pickup Online' },
                    { val: 'dine-in'  as OrderType, icon: '🪑', label: 'Dine In' },
                    { val: 'takeaway' as OrderType, icon: '🥡', label: 'Take Away' },
                  ]).map(o => (
                    <div
                      key={o.val}
                      className={`sel-card ${orderType === o.val ? 'sel-active' : ''}`}
                      onClick={() => { setOrderType(o.val); if (o.val !== 'dine-in') setTableNo(null); }}
                    >
                      <span className="sel-icon">{o.icon}</span>
                      {o.label}
                    </div>
                  ))}
                </div>
              </div>

              {orderType === 'dine-in' && (
                <div className="form-group">
                  <label className="form-label">Pilih Nomor Meja</label>
                  <div className="table-grid">
                    {Array.from({ length: tableCount }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        className={`tbl-btn ${tableNo === n ? 'tbl-active' : ''}`}
                        onClick={() => setTableNo(n)}
                      >
                        <span className="tbl-icon">🪑</span>
                        <span>{n}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Catatan (opsional)</label>
                <input
                  className="form-input"
                  placeholder="Contoh: tidak pedas, tanpa bawang…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </>
          )}

          {/* ── STEP 3: Payment ── */}
          {step === 3 && (
            <>
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
                    style={{ width: '400px', height: '400px', objectFit: 'contain', borderRadius: '8px' }}
                  />
                  <div className="qris-label">Scan QRIS untuk Membayar</div>
                  <div className="qris-sub">Healthy Yummy · {formatCurrency(cartTotal)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 8 }}>
                    Atau tunjukkan kode pesanan ke kasir untuk scan QRIS
                  </div>
                </div>
              )}

              {/* Summary */}
              <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
                <div className="form-label" style={{ marginBottom: 10 }}>Ringkasan Pesanan</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text2)' }}>Pemesan</span>
                    <strong>{isMember && selectedMember ? selectedMember.name : guestName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text2)' }}>Tipe</span>
                    <strong>{orderTypeLabel(orderType, tableNo)}</strong>
                  </div>
                </div>
                <div className="divider" style={{ marginBottom: 10 }} />
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="modal-foot">
          {step > 1 && <button className="btn btn-ghost" onClick={back}>← Kembali</button>}
          <button className="btn btn-ghost" onClick={onClose}>Batal</button>
          {step < 3
            ? <button className="btn btn-primary" disabled={step === 1 ? !ok1 : !ok2} onClick={next}>Lanjut →</button>
            : <button className="btn btn-green" disabled={!ok3} onClick={handlePlace}>✓ Konfirmasi</button>
          }
        </div>
      </div>
    </div>
  );
}
