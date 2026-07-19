import type { Metadata } from 'next';

import '@ims/ui/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'Enterprise inventory management for modern operations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
