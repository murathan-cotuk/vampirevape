import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vampire Vape - Premium E-Liquids & Vaping Produkte',
  description: 'Entdecken Sie unsere Premium E-Liquids, Vaping Hardware und Zubehör. Top Qualität, schneller Versand, beste Preise.',
  keywords: 'E-Liquids, Vaping, E-Zigaretten, Vampire Vape, Premium Liquids',
  authors: [{ name: 'Vampire Vape' }],
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
        {children}
      </body>
    </html>
  );
}

