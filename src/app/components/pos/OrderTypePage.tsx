'use client';
import { useRouter } from 'next/navigation';
import { useApp } from '../../lib/AppContext';
import type { OrderType } from '../../types';

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  'pickup': '📦 Pickup',
  'dine-in': '🍽️ Dine In',
  'takeaway': '🛵 Takeaway',
};

const LEFT_ADS = [
  {
    id: 1,
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=150&fit=crop',
  },
  {
    id: 2,
    brand: 'Kahf',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=150&fit=crop',
  },
  {
    id: 5,
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=150&fit=crop',
  },
];

const RIGHT_ADS = [
  {
    id: 3,
    brand: 'Telkomsel',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=150&fit=crop',
  },
  {
    id: 4,
    brand: 'Honda',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=200&h=150&fit=crop',
  },
];

function AdCard({ ad }: { ad: typeof LEFT_ADS[0] }) {
  return (
    <div className="ad-card">
      <img src={ad.image} alt={ad.brand} className="ad-image" />
      <div className="ad-label">Ad • {ad.brand}</div>
    </div>
  );
}

export default function OrderTypePage() {
  const router = useRouter();
  const { orderType, setOrderType } = useApp();

  const orderTypes: { type: OrderType; emoji: string; desc: string }[] = [
    { type: 'pickup', emoji: '📦', desc: 'Ambil sendiri di tempat' },
    { type: 'dine-in', emoji: '🍽️', desc: 'Makan di tempat' },
    { type: 'takeaway', emoji: '🛵', desc: 'Di antar ke alamat tujuan' },
  ];

  const handleSelect = (type: OrderType) => {
    setOrderType(type);
    router.push('/pos/member');
  };

  return (
    <>
      <div className="left-column">
        {LEFT_ADS.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      <div className="center-content">
        <div className="page-header">
          <h1 className="page-title">🛵 Pilih Tipe Pemesanan</h1>
          <p className="page-subtitle"> Bagaimana Anda ingin menerima pesanan?</p>
        </div>

        <div className="order-type-grid">
          {orderTypes.map(({ type, emoji, desc }) => (
            <button
              key={type}
              className={`order-type-card ${orderType === type ? 'selected' : ''}`}
              onClick={() => handleSelect(type)}
            >
              <div className="order-type-emoji">{emoji}</div>
              <div className="order-type-label">{ORDER_TYPE_LABELS[type]}</div>
              <div className="order-type-desc">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="right-column">
        {RIGHT_ADS.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      <style jsx>{`
        :global(body) {
          overflow: auto !important;
        }
        .left-column {
          position: fixed;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 16px;
          z-index: 100;
        }
        .right-column {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 16px;
          z-index: 100;
        }
        .center-content {
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          padding: 24px 16px;
        }
        .ad-card {
          width: 200px;
          height: 150px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.12);
        }
        .ad-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
        }
        .ad-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .ad-card:hover .ad-image {
          transform: scale(1.05);
        }
        .ad-label {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0,0,0,0.6);
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 6px;
          border-radius: 3px;
          text-transform: uppercase;
        }
        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 6px;
        }
        .page-subtitle {
          font-size: 14px;
          color: var(--text2);
        }
        .order-type-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .order-type-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 24px;
          background: var(--surface);
          border: 2px solid var(--border);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .order-type-card:hover {
          border-color: var(--accent);
          background: var(--surface2);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }
        .order-type-card.selected {
          border-color: var(--accent);
          background: var(--accent-bg);
        }
        .order-type-emoji {
          font-size: 40px;
          margin-bottom: 10px;
        }
        .order-type-label {
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 6px;
        }
        .order-type-desc {
          font-size: 13px;
          color: var(--text2);
        }
        @media (max-width: 1024px) {
          .left-column, .right-column {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
