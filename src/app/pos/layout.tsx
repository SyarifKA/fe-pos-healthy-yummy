'use client';
import Sidebar from '../components/shared/Sidebar';
import CartPanel from '../components/pos/CartPanel';

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        {children}
      </div>
      <CartPanel />
    </div>
  );
}
