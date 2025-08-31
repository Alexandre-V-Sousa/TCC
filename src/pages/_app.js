// pages/_app.js
import "@/styles/globals.css";
import Image from "next/image";
import Link from "next/link";
import { User, ShoppingCart, Mail } from "lucide-react";

export default function App({ Component, pageProps }) {
  return (
    <div className="bg-[#ECFFEB] min-h-screen flex flex-col">
      {/* Navegação */}
      <nav className="bg-[#ECFFEB] shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Image src="/logo.png" alt="Logo" width={80} height={80} className="rounded-full" />
            <ul className="flex space-x-5">
              <li><Link href="/" className="text-black hover:underline">Início</Link></li>
              <li><Link href="/produtos" className="text-black hover:underline">Produtos</Link></li>
              <li><Link href="/carrinho" className="text-black hover:underline">Carrinho</Link></li>
            </ul>
          </div>
          <div className="text-center text-black">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="border border-gray-300 rounded-full px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-black hover:text-green-700 transition">
              <User size={28} />
            </Link>
            <Link href="/carrinho" className="text-black hover:text-green-700 transition">
              <ShoppingCart size={28} />
            </Link>
            <Link href="/contato" className="text-black hover:text-green-700 transition">
              <Mail size={28} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Conteúdo da página */}
      <main className="flex-1">
        <Component {...pageProps} />
      </main>

      {/* Rodapé */}
      <footer className="py-12 text-center">
        <p className="text-gray-600">&copy; 2023 Agropecuária Patrícia. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
