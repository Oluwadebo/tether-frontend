import './globals.css';
import type { Metadata } from 'next';
import { Instrument_Sans, JetBrains_Mono, Fraunces } from 'next/font/google';
import Providers from './providers';

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = { title: 'Tether' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
