import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono, Fraunces } from 'next/font/google';
import Providers from './providers';

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans-face' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-face' });
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif-face' });

export const metadata: Metadata = { title: 'Tether' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, interactiveWidget: 'resizes-content' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
