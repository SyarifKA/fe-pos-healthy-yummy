'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '../../lib/ThemeContext';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const POS_NAV = [
    { key: '/pos',         icon: '🍽️', label: 'Order Menu' },
    { key: '/pos/status',  icon: '📦', label: 'Cek Status' },
  ];

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
        <button className="theme-toggle-btn" onClick={toggle}>
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </nav>
  );
}
