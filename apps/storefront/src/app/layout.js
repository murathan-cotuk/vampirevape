import './globals.css';
import { Inter } from 'next/font/google';
import PageLoader from '@/components/common/PageLoader';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vampire Vape - Premium E-Liquids & Vaping Produkte',
  description: 'Entdecken Sie unsere Premium E-Liquids, Vaping Hardware und Zubehör. Top Qualität, schneller Versand, beste Preise.',
  keywords: 'E-Liquids, Vaping, E-Zigaretten, Vampire Vape, Premium Liquids',
  authors: [{ name: 'Vampire Vape' }],
  icons: {
    icon: [
      {
        url: 'https://cdn.shopify.com/s/files/1/0969/5084/5726/files/Vlad_Logo_big.png?v=1767097230',
        sizes: 'any',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: 'https://cdn.shopify.com/s/files/1/0969/5084/5726/files/Vlad_Logo_big.png?v=1767097230',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: [
      {
        url: 'https://cdn.shopify.com/s/files/1/0969/5084/5726/files/Vlad_Logo_big.png?v=1767097230',
      },
    ],
  },
  openGraph: {
    title: 'Vampire Vape - Premium E-Liquids',
    description: 'Entdecken Sie unsere Premium E-Liquids und Vaping Produkte',
    type: 'website',
    locale: 'de_DE',
    siteName: 'Vampire Vape',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <PageLoader />
        {children}
      </body>
    </html>
  );
}

