'use client';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/shared/Sidebar';
import CartPanel from '../components/pos/CartPanel';

export default function POSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide sidebar and cart on order-type and member pages
  const showSidebar = !pathname.includes('/order-type') && !pathname.includes('/member');
  const showCart = !pathname.includes('/order-type') && !pathname.includes('/member');

  return (
    <div className="app-shell">
      {showSidebar && <Sidebar />}
      <div 
        className="main" 
        style={{
          width: !showSidebar ? '100%' : undefined,
          overflow: !showSidebar ? 'visible' : undefined
        }}
      >
        {children}
      </div>
      {showCart && <CartPanel />}
    </div>
  );
}
