import Footer from "@/components/sections/Footer"
import Header from "@/components/sections/Header"
import '@/app/globals.css';
import "./pages.css";

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <main className="grow" id="hero-content">
          {children}
          <Footer/>
        </main>
  )
}
