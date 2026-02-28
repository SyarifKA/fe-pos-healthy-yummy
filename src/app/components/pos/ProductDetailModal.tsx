'use client';
import Image from 'next/image';
import { formatCurrency } from '../../lib/constants';
import type { MenuItem } from '../../types';

interface Props {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: () => void;
}

const TAG_CONFIG: Record<string, { label: string; style: string }> = {
  bestseller: { label: '⭐ Terlaris', style: 'tag-bestseller' },
  new:        { label: '🆕 Baru',     style: 'tag-new'        },
  spicy:      { label: '🌶️ Pedas',   style: 'tag-spicy'      },
  vegetarian: { label: '🌿 Veg',      style: 'tag-veg'        },
  healthy:    { label: '💪 Sehat',    style: 'tag-healthy'    },
};

export default function ProductDetailModal({ item, onClose, onAddToCart }: Props) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal product-detail-modal">
        <div className="modal-head">
          <div className="modal-title">{item.emoji} {item.name}</div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          {/* Product Image */}
          {item.image && (
            <div className="product-detail-image">
              <Image 
                src={item.image} 
                alt={item.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 400px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          
          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="product-detail-tags">
              {item.tags.map((t: string) => (
                <span key={t} className={`menu-tag-sm ${TAG_CONFIG[t]?.style ?? ''}`}>
                  {TAG_CONFIG[t]?.label ?? t}
                </span>
              ))}
            </div>
          )}
          
          {/* Description */}
          <div className="product-detail-section">
            <div className="product-detail-label">Deskripsi</div>
            <div className="product-detail-text">{item.desc}</div>
          </div>
          
          {/* Pre-order Info */}
          {item.isPreOrder && (
            <div className="product-detail-section product-detail-preorder">
              <div className="product-detail-label">📦 Pre-Order</div>
              <div className="product-detail-preorder-info">
                <div className="preorder-badge">Pre-Order</div>
                {item.preOrderInfo && (
                  <div className="preorder-time">{item.preOrderInfo}</div>
                )}
              </div>
              {item.preOrderDescription && (
                <div className="product-detail-text">{item.preOrderDescription}</div>
              )}
            </div>
          )}
          
          {/* Nutrition Info */}
          {item.calories !== undefined && item.calories > 0 && (
            <div className="product-detail-section">
              <div className="product-detail-label">🔥 Info Nutrisi</div>
              <div className="product-detail-calories">{item.calories} kalori</div>
            </div>
          )}
          
          {/* Price */}
          <div className="product-detail-price">
            <span className="price-label">Harga:</span>
            <span className="price-value">{formatCurrency(item.price)}</span>
          </div>
          
          {/* Add to Cart Button */}
          <button className="btn btn-primary product-detail-add-btn" onClick={onAddToCart}>
            🛒 Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
