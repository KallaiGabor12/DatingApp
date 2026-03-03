import { Outfit } from 'next/font/google';
import '@/app/globals.css';
import { Montserrat } from 'next/font/google'
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL("https://cool-finish.hu"),
  twitter: {
    card: "summary_large_image",
    images: "https://cool-finish.hu/images/og/og.png",
  },
  openGraph: {
    images: "https://cool-finish.hu/images/og/og.png",
  }
};

const outfit = Outfit({
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ['latin'],      // critical — smaller file
  weight: ['400', '500', '600', '700', '800'],  // ONLY what you actually use
  style: ['normal', 'italic'],       // add 'italic' only if needed
  display: 'swap',
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={montserrat.className}>
      <body className={`${outfit.className} min-h-screen flex flex-col`}>
            {children}
      </body>
    </html>
  );
}
