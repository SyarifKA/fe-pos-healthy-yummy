'use client';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '../../lib/ThemeContext';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const POS_NAV = [
    { key: '/pos',         icon: '🍽️', label: 'Order Menu' },
    { key: '/pos/status',  icon: '📦', label: 'Cek Status' },
  ];

  const orderUrl = 'https://hy.menu.alf-corp.id/pos';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(orderUrl)}&bgcolor=FFFFFF&color=000000`;

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">🥗</div>
        <div className="logo-text">
          <div className="logo-name">Healthy Yummy</div>
        </div>
      </div>

      <div className="sidebar-section">Kasir</div>

      {POS_NAV.map(item => (
        <button
          key={item.key}
          className={`nav-btn ${pathname === item.key ? 'active' : ''}`}
          onClick={() => router.push(item.key)}
        >
          <span className="nicon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}

      {/* Footer */}
      <div className="sidebar-footer">
        {/* QR Code Section - Above Theme Toggle */}
        <div className="sidebar-qr-section">
          <div className="qr-container">
            <div className="qr-header">
              <span className="qr-icon">📱</span>
              <span className="qr-title-text">Scan untuk Order</span>
            </div>
            <div className="qr-subtitle-text">Order via device Anda</div>
            <div className="qr-code-wrapper">
              <div className="qr-frame">
                <Image 
                  src={qrCodeUrl}
                  alt="QR Code untuk Order"
                  width={180}
                  height={180}
                  className="qr-code-image"
                  unoptimized
                />
              </div>
            </div>
            <div className="qr-url-box">
              <span className="qr-url-text text-black">{orderUrl}</span>
            </div>
            {/* <div className="qr-instruction">
              🖱️ Klik untuk copied link
            </div> */}
          </div>
        </div>

        {/* Theme Toggle */}
        <button className="theme-toggle-btn" onClick={toggle}>
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </nav>
  );
}
