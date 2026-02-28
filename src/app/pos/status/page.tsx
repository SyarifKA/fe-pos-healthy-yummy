'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../../lib/AppContext';
import type { Order, OrderStatus } from '../../types';
import { formatCurrency, generateWhatsAppMessage, getStatusSteps } from '../../lib/constants';

interface StatusStep {
  key: OrderStatus;
  label: string;
  description: string;
  icon: string;
}

const STATUS_STEPS: StatusStep[] = [
  { key: 'waiting_payment', label: 'Menunggu Pembayaran', description: 'Silakan konfirmasi pembayaran ke kasir', icon: '💳' },
  { key: 'paid', label: 'Pembayaran Dikonfirmasi', description: 'Pembayaran berhasil', icon: '✅' },
  { key: 'processing', label: 'Pesanan Diproses', description: 'Kitchen sedang menyiapkan', icon: '👨‍🍳' },
  { key: 'ready', label: 'Siap Disajikan', description: 'Pelayan sedang menuju meja Anda', icon: '🍽️' },
];

function getStatusIndex(status: OrderStatus, orderType: string): number {
  const steps = getStatusSteps(orderType);
  return steps.findIndex(s => s.key === status);
}

export default function OrderStatusPage() {
  const { orders } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh order status every 5 seconds when an order is found
  useEffect(() => {
    if (!foundOrder) return;

    const interval = setInterval(() => {
      const updatedOrder = orders.find(o => o.code === foundOrder.code);
      if (updatedOrder && updatedOrder.status !== foundOrder.status) {
        setFoundOrder(updatedOrder);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [foundOrder, orders]);

  const handleSearch = () => {
    if (!searchCode.trim()) return;
    
    const code = searchCode.toUpperCase().trim();
    const order = orders.find(o => o.code.toUpperCase() === code);
    
    if (order) {
      setFoundOrder(order);
      setNotFound(false);
    } else {
      setFoundOrder(null);
      setNotFound(true);
    }
  };

  const handleRefresh = () => {
    if (!foundOrder) return;
    setIsRefreshing(true);
    const updatedOrder = orders.find(o => o.code === foundOrder.code);
    if (updatedOrder) {
      setFoundOrder(updatedOrder);
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleShareWhatsApp = () => {
    if (!foundOrder) return;
    const message = generateWhatsAppMessage(foundOrder);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const currentStepIndex = foundOrder ? getStatusIndex(foundOrder.status, foundOrder.orderType) : -1;

  // Get status steps based on order type
  const statusSteps = foundOrder ? getStatusSteps(foundOrder.orderType) : [];

  return (
    <div className="status-page">
      <div className="status-header">
        <h1>🔍 Cek Status Pesanan</h1>
        <p>Masukkan kode pesanan Anda untuk melacak status</p>
      </div>

      <div className="status-search">
        <div className="search-box">
          <input
            type="text"
            placeholder="Masukkan kode pesanan (contoh: HY-ABC123)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            Cari
          </button>
        </div>
      </div>

      {notFound && (
        <div className="status-not-found">
          <div className="not-found-icon">❌</div>
          <h3>Pesanan Tidak Ditemukan</h3>
          <p>Kode pesanan yang Anda masukkan tidak valid. Silakan periksa kembali kode pesanan Anda.</p>
        </div>
      )}

      {foundOrder && (
        <div className="status-result">
          <div className="order-info-card">
            <div className="order-code-display">
              <span className="label">Kode Pesanan</span>
              <span className="code">{foundOrder.code}</span>
              <button 
                onClick={handleRefresh} 
                className="refresh-btn"
                disabled={isRefreshing}
                title="Refresh status pesanan"
              >
                {isRefreshing ? '⏳' : '🔄'} Refresh
              </button>
            </div>
            
            {/* Payment Instructions */}
            {(foundOrder.status === 'waiting_payment' || foundOrder.status === 'pending') && (
              <div className="payment-instructions">
                {foundOrder.payment === 'cash' && (
                  <div className="payment-box cash">
                    <span className="payment-icon">💵</span>
                    <div className="payment-text">
                      <strong>Pembayaran Cash</strong>
                      <span>Silakan lakukan pembayaran di kasir</span>
                    </div>
                  </div>
                )}
                {foundOrder.payment === 'qris' && (
                  <div className="payment-box qris">
                    <img 
                      src="/qris.jpeg" 
                      alt="QRIS" 
                      style={{ width: '300px', height: '300px', borderRadius: '8px', background: 'white', padding: '4px' }}
                    />
                    <div className="payment-text">
                      <strong>Pembayaran QRIS</strong>
                      <span>Scan QRIS ini jika anda belum melakukan pembayaran</span>
                    </div>
                  </div>
                )}
                {foundOrder.payment === 'transfer' && (
                  <div className="payment-box transfer">
                    <span className="payment-icon">🏦</span>
                    <div className="payment-text">
                      <strong>Transfer Bank</strong>
                      <span>Transfer ke rekening yang tersedia di kasir</span>
                    </div>
                  </div>
                )}
                {foundOrder.payment === 'debit' && (
                  <div className="payment-box debit">
                    <span className="payment-icon">💳</span>
                    <div className="payment-text">
                      <strong>Kartu Debit</strong>
                      <span>Silakan lakukan pembayaran di kasir dengan kartu debit</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="order-details">
              <div className="detail-row">
                <span className="label">Pemesan:</span>
                <span className="value">{foundOrder.customerName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Jenis:</span>
                <span className="value">
                  {foundOrder.orderType === 'dine-in' ? `🍽️ Dine In - Meja ${foundOrder.tableNo}` : 
                   foundOrder.orderType === 'pickup' ? '🛵 Pickup' : '🥡 Take Away'}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Pembayaran:</span>
                <span className="value payment-badge">{foundOrder.payment.toUpperCase()}</span>
              </div>
              <div className="detail-row">
                <span className="label">Total:</span>
                <span className="value">{formatCurrency(foundOrder.total)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Waktu:</span>
                <span className="value">
                  {new Date(foundOrder.createdAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="status-timeline">
            <h3>Status Pesanan</h3>
            <div className="timeline">
              {statusSteps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                  <div 
                    key={step.key} 
                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''}`}
                  >
                    <div className="step-indicator">
                      <div className="step-icon">
                        {isCompleted ? '✓' : isCurrent ? step.icon : '○'}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`step-line ${isCompleted ? 'completed' : ''}`} />
                      )}
                    </div>
                    <div className="step-content">
                      <div className={`step-label ${isCurrent ? 'current' : ''}`}>
                        {step.label}
                      </div>
                      <div className="step-description">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {foundOrder.status === 'cancelled' && (
            <div className="status-cancelled">
              <span className="cancelled-icon">🚫</span>
              <p>Pesanan ini telah dibatalkan</p>
            </div>
          )}

          <div className="order-items-summary">
            <h4>Ringkasan Pesanan</h4>
            <div className="items-list">
              {foundOrder.items.map((item, idx) => (
                <div key={idx} className="item-row">
                  <span className="item-qty">{item.qty}x</span>
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Photo for Pickup Orders */}
          {foundOrder.orderType === 'pickup' && foundOrder.evidencePhoto && (
            <div className="evidence-photo-section">
              <h4>Foto Bukti Pengantaran</h4>
              <img 
                src={foundOrder.evidencePhoto} 
                alt="Bukti Pengantaran" 
                className="evidence-image"
              />
            </div>
          )}

          {/* Share Button */}
          <button
            className="share-whatsapp-btn"
            onClick={handleShareWhatsApp}
          >
            📱 Share ke WhatsApp
          </button>

          <button 
            onClick={() => { setFoundOrder(null); setSearchCode(''); }} 
            className="search-another-btn"
          >
            🔍 Cari Pesanan Lain
          </button>
        </div>
      )}

      {!foundOrder && !notFound && (
        <div className="status-instructions">
          <h3>Cara Melacak Pesanan</h3>
          <ol>
            <li>Cari kode pesanan di struk atau nota pembayaran Anda</li>
            <li>Masukkan kode pesanan pada kolom di atas</li>
            <li>Klik tombol "Cari" untuk melihat status pesanan</li>
          </ol>
          <div className="example-code">
            <span className="example-label">Contoh kode pesanan:</span>
            <span className="example-code-text">HY-ABC123</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .status-page {
          padding: 24px;
          max-width: 600px;
          margin: 0 auto;
          overflow-y: auto;
          flex: 1;
        }

        .status-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .status-header h1 {
          font-size: 28px;
          margin-bottom: 8px;
          color: var(--text-primary, #333);
        }

        .status-header p {
          color: var(--text-secondary, #666);
          font-size: 14px;
        }

        .status-search {
          margin-bottom: 24px;
        }

        .search-box {
          display: flex;
          gap: 12px;
        }

        .search-input {
          flex: 1;
          padding: 14px 18px;
          font-size: 16px;
          border: 2px solid var(--border-color, #e0e0e0);
          border-radius: 12px;
          background: var(--bg-secondary, #fff);
          color: var(--text-primary, #333);
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color, #4CAF50);
        }

        .search-btn {
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          background: var(--primary-color, #4CAF50);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .search-btn:hover {
          opacity: 0.9;
        }

        .status-not-found {
          text-align: center;
          padding: 40px 20px;
          background: var(--bg-secondary, #fff);
          border-radius: 16px;
          border: 2px dashed var(--border-color, #e0e0e0);
        }

        .not-found-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .status-not-found h3 {
          margin-bottom: 8px;
          color: var(--text-primary, #333);
        }

        .status-not-found p {
          color: var(--text-secondary, #666);
        }

        .status-result {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .order-info-card {
          background: var(--bg-secondary, #fff);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .order-code-display {
          text-align: center;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color, #e0e0e0);
          margin-bottom: 16px;
        }

        .order-code-display .label {
          display: block;
          font-size: 12px;
          color: var(--text-secondary, #666);
          margin-bottom: 4px;
        }

        .order-code-display .code {
          font-size: 28px;
          font-weight: 700;
          color: var(--primary-color, #4CAF50);
          letter-spacing: 2px;
        }

        .payment-instructions {
          margin-bottom: 16px;
        }

        .payment-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .payment-box.cash {
          background: #FFF3E0;
          border: 1px solid #FFB74D;
        }

        .payment-box.qris {
          background: #E8F5E9;
          border: 1px solid #81C784;
        }

        .payment-box.transfer {
          background: #E3F2FD;
          border: 1px solid #64B5F6;
        }

        .payment-box.debit {
          background: #F3E5F5;
          border: 1px solid #BA68C8;
        }

        .payment-icon {
          font-size: 24px;
        }

        .payment-text {
          display: flex;
          flex-direction: column;
        }

        .payment-text strong {
          font-size: 14px;
          color: var(--text-primary, #333);
        }

        .payment-text span {
          font-size: 12px;
          color: var(--text-secondary, #666);
        }

        .order-details .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }

        .order-details .label {
          color: var(--text-secondary, #666);
        }

        .order-details .value {
          font-weight: 500;
          color: var(--text-primary, #333);
        }

        .payment-badge {
          background: var(--accent2, #9C27B0);
          color: white !important;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px !important;
        }

        .status-timeline {
          background: var(--bg-secondary, #fff);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .status-timeline h3 {
          margin-bottom: 20px;
          font-size: 18px;
          text-align: center;
        }

        .timeline {
          display: flex;
          flex-direction: column;
        }

        .timeline-step {
          display: flex;
          gap: 16px;
          position: relative;
        }

        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          background: var(--bg-tertiary, #f5f5f5);
          color: var(--text-secondary, #999);
          border: 2px solid var(--border-color, #e0e0e0);
          z-index: 1;
        }

        .timeline-step.completed .step-icon {
          background: var(--primary-color, #4CAF50);
          border-color: var(--primary-color, #4CAF50);
          color: white;
        }

        .timeline-step.current .step-icon {
          background: #ff9800;
          border-color: #ff9800;
          color: white;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .step-line {
          width: 2px;
          height: 30px;
          background: var(--border-color, #e0e0e0);
          margin: 4px 0;
        }

        .step-line.completed {
          background: var(--primary-color, #4CAF50);
        }

        .step-content {
          padding-bottom: 24px;
        }

        .step-label {
          font-weight: 600;
          color: var(--text-secondary, #999);
          margin-bottom: 4px;
        }

        .step-label.current {
          color: #ff9800;
        }

        .timeline-step.completed .step-label {
          color: var(--text-primary, #333);
        }

        .step-description {
          font-size: 13px;
          color: var(--text-secondary, #666);
        }

        .status-cancelled {
          text-align: center;
          padding: 20px;
          background: #ffebee;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .cancelled-icon {
          font-size: 32px;
        }

        .status-cancelled p {
          color: #c62828;
          font-weight: 500;
        }

        .order-items-summary {
          background: var(--bg-secondary, #fff);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .order-items-summary h4 {
          margin-bottom: 16px;
          font-size: 16px;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-color, #eee);
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-qty {
          font-weight: 600;
          color: var(--primary-color, #4CAF50);
          min-width: 30px;
        }

        .item-name {
          flex: 1;
          color: var(--text-primary, #333);
        }

        .item-price {
          font-weight: 500;
          color: var(--text-secondary, #666);
        }

        .share-whatsapp-btn {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          margin-bottom: 12px;
          transition: opacity 0.2s;
        }

        .share-whatsapp-btn:hover {
          opacity: 0.9;
        }

        .search-another-btn {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          background: var(--bg-secondary, #fff);
          color: var(--primary-color, #4CAF50);
          border: 2px solid var(--primary-color, #4CAF50);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .search-another-btn:hover {
          background: var(--primary-color, #4CAF50);
          color: white;
        }

        .status-instructions {
          background: var(--bg-secondary, #fff);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .status-instructions h3 {
          margin-bottom: 16px;
          font-size: 18px;
        }

        .status-instructions ol {
          padding-left: 20px;
          color: var(--text-secondary, #666);
          line-height: 1.8;
        }

        .example-code {
          margin-top: 20px;
          padding: 16px;
          background: var(--bg-tertiary, #f5f5f5);
          border-radius: 8px;
          text-align: center;
        }

        .example-label {
          display: block;
          font-size: 12px;
          color: var(--text-secondary, #666);
          margin-bottom: 8px;
        }

        .example-code-text {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-color, #4CAF50);
          letter-spacing: 2px;
        }
      `}</style>
    </div>
  );
}
