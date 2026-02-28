import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './lib/ThemeContext';
import { AppProvider } from './lib/AppContext';

export const metadata: Metadata = {
  title: 'Healthy Yummy POS',
  description: 'Point of Sale – Healthy Yummy',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ThemeProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
