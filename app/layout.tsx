import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono, Fraunces } from 'next/font/google';
import Providers from './providers';

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans-face' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-face' });
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif-face' });

const title = 'Tether: every conversation is a thread';
const description = 'See who is holding each customer conversation, the AI or your team, and take over the moment it matters.';

export const metadata: Metadata = {
  // Needed so the preview image gets a full web address when pasted into WhatsApp, Slack or LinkedIn.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tether-frontend.vercel.app'),
  title,
  description,
  openGraph: { title, description, siteName: 'Tether', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
  // A private client demo: keep it out of search results.
  robots: { index: false, follow: false },
};
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
