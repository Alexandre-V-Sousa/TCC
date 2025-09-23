import Link from "next/link";
import { Mail, Instagram, Facebook, Phone } from "lucide-react";

export default function Rodape() {
  return (
    <footer className="bg-[#ECFFEB] border-t border-green-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between gap-8">
        {/* Logo e descrição */}
        <div className="flex-1 flex flex-col gap-3">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-full mb-2" />
          <span className="text-green-800 font-bold text-lg">Agro Patricia</span>
          <span className="text-gray-600 text-sm">
            Tudo para seu pet com carinho, qualidade e entrega rápida.
          </span>
        </div>
        {/* Links rápidos */}
        <div className="flex-1">
          <h4 className="text-green-700 font-semibold mb-3">Links Rápidos</h4>
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link href="/" className="hover:text-green-700">Início</Link>
            </li>
            <li>
              <Link href="/produtos" className="hover:text-green-700">Produtos</Link>
            </li>
            <li>
              <Link href="/servicos" className="hover:text-green-700">Serviços</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-green-700">Blog</Link>
            </li>
          </ul>
        </div>
        {/* Contato e redes */}
        <div className="flex-1">
          <h4 className="text-green-700 font-semibold mb-3">Contato</h4>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <Mail size={18} /> AgroPatricia@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> (11) 99999-9999
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={18} /> @agropatricia04
            </li>
            <li className="flex items-center gap-2">
              <Facebook size={18} /> /agropatricia04
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs py-4 border-t border-green-100">
        © {new Date().getFullYear()} PetShop Verde. Todos os direitos reservados.
      </div>
    </footer>
  );
}