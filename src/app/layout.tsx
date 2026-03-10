import { Outfit } from 'next/font/google';
import '@/app/globals.css';
import { Montserrat } from 'next/font/google'
import { Metadata } from 'next';

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
