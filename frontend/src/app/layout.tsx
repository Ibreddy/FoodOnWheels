import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { CartProvider } from '../context/CartContext';
import { LocationProvider } from '../context/LocationContext';
import { OwnerProvider } from '../context/OwnerContext';
import { AppShell } from '../components/common/AppShell';

export const metadata: Metadata = {
  title: 'StreetBite | Global Street Food & Real-Time Vendor Tracking',
  description: 'Find restaurants and mobile food vendors around you in real time with 3D vehicle experiences, live GPS tracking, video reels, and foodie rewards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg text-white min-h-screen antialiased selection:bg-brand-orange selection:text-white">
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <LocationProvider>
                <CartProvider>
                  <OwnerProvider>
                    <AppShell>{children}</AppShell>
                  </OwnerProvider>
                </CartProvider>
              </LocationProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
