import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Resonate — Premium Audio",
  description: "A full-stack e-commerce demo built with Next.js, Express, and PostgreSQL.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
