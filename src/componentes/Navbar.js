"use client";
import Image from "next/image";
import Link from "next/link";
import { Dog, User, ShoppingCart, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [produtos, setProdutos] = useState([]);

  // Busca produtos do Supabase e resolve imagens
  useEffect(() => {
    async function fetchProdutos() {
      const { data, error } = await supabase.from("prod").select("*");
      if (!error && data) {
        const produtosComImg = await Promise.all(
          data.map(async (p) => {
            const imgField = p.imagen ?? p.imagem ?? "";
            let resolved = "/placeholder.png";

            try {
              if (!imgField) {
                resolved = "/placeholder.png";
              } else if (
                typeof imgField === "string" &&
                (imgField.startsWith("http://") || imgField.startsWith("https://"))
              ) {
                resolved = decodeURI(imgField);
              } else {
                const { data: urlData, error: urlErr } = supabase.storage
                  .from("imagen dos produtos")
                  .getPublicUrl(String(imgField));
                if (!urlErr && urlData && urlData.publicUrl) {
                  resolved = urlData.publicUrl;
                } else {
                  resolved = String(imgField);
                }
              }
            } catch (e) {
              resolved = "/placeholder.png";
            }

            return { ...p, imagenResolved: resolved };
          })
        );
        setProdutos(produtosComImg);
      }
      if (error) console.log("Erro ao buscar produtos:", error);
    }
    fetchProdutos();
  }, []);

  // Carrega usuário logado do localStorage
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuarioLogado) {
      setUsuario(usuarioLogado);
    }
  }, []);

  const filteredProdutos = produtos.filter((produto) =>
    (produto.nome || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <nav className="bg-[#ECFFEB] shadow relative z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {/* LOGO + MENU */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full"
          />

          {/* MENU PRINCIPAL */}
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-5 text-black">
            <li>
              <Link href="/" className="hover:text-green-700 font-medium">
                Início
              </Link>
            </li>
            <li
              className="relative"
              onMouseEnter={() => setOpenDropdown("produtos")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link href="/produtos" className="hover:text-green-700 font-medium">
                Produtos
              </Link>

              {openDropdown === "produtos" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute left-0 top-8 bg-white shadow-xl rounded-xl py-2 w-56"
                >
                  <Link href="/caes" className="block px-4 py-2 hover:bg-green-100 text-gray-700">
                    Cães
                  </Link>
                  <Link href="/gatos" className="block px-4 py-2 hover:bg-green-100 text-gray-700">
                    Gatos
                  </Link>
                  <Link href="/peixes" className="block px-4 py-2 hover:bg-green-100 text-gray-700">
                    Peixes
                  </Link>
                  <Link href="/casa-e-jardim" className="block px-4 py-2 hover:bg-green-100 text-gray-700">
                    Casa & Jardim
                  </Link>
                  <Link href="/promocoes" className="block px-4 py-2 hover:bg-green-100 text-gray-700">
                    Promoções
                  </Link>
                </motion.div>
              )}
            </li>
            <li>
              <Link href="/blog" className="hover:text-green-700 font-medium">
                Blog / Dicas
              </Link>
            </li>
          </ul>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="w-full md:w-auto text-center md:text-left relative">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="border border-gray-300 rounded-full px-12 py-4 w-full md:max-w-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md text-black"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
            />
          </svg>

          {isFocused && searchTerm.length > 0 && (
            <div className="absolute mt-2 left-0 w-full md:max-w-lg bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
              {filteredProdutos.length > 0 ? (
                filteredProdutos.map((produto) => (
                  <Link
                    key={produto.id}
                    href={`/produto/${produto.id_prod}`}
                    className="flex items-center p-3 hover:bg-green-100 cursor-pointer"
                  >
                    <Image
                      src={produto.imagenResolved || "/placeholder.png"}
                      alt={produto.nome || "Produto"}
                      width={50}
                      height={50}
                      className="rounded-lg object-cover"
                    />
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-gray-800">{produto.nome || "Produto sem nome"}</p>
                      <p className="text-sm text-green-600 font-semibold">
                        R$ {(produto.valor_venda ?? produto.preco ?? 0).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="p-3 text-gray-500">Nenhum produto encontrado</p>
              )}
            </div>
          )}
        </div>

        {/* ÍCONES À DIREITA */}
        <div className="flex items-center space-x-6 text-black">
          <Link href="/animais" className="relative group flex items-center cursor-pointer">
            <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
              <Dog className="text-black w-6 h-6" />
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 mt-12 px-3 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300">
              Meus Pets
            </span>
          </Link>

          <Link href={usuario ? "/usuario" : "/login"} className="relative group flex items-center cursor-pointer">
            <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
              <User className="text-black w-6 h-6" />
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 mt-12 px-3 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300">
              {usuario ? usuario.nome : "Login"}
            </span>
          </Link>

          <Link href="/carrinho" className="relative group flex items-center cursor-pointer">
            <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
              <ShoppingCart className="text-black w-6 h-6" />
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 mt-12 px-3 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300">
              Carrinho
            </span>
          </Link>

          <Link href="/contato" className="relative group flex items-center cursor-pointer">
            <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
              <Mail className="text-black w-6 h-6" />
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 mt-12 px-3 py-1 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300">
              Contato
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
