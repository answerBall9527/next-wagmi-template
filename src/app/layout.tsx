'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Web3Modal } from '@/context/Web3Modal';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
import { useVConsole } from '@/hooks/useVConsole';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
  title: 'Wagmi',
  description: 'This is a description of the site.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  useVConsole();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Modal>
          {children}
          <Toaster position="bottom-right" reverseOrder={false} />
        </Web3Modal>
      </body>
    </html>
  );
}
