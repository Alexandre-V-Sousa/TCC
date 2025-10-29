"use client";

import Image from "next/image";
import Link from "next/link";
import { Dog, User, ShoppingCart, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [tipos, setTipos] = useState([]);

  const dropdownTimeout = useRef(null);

  // Busca produtos
  useEffect(() => {
    async function fetchProdutos() {
      const { data, error } = await supabase.from("prod").select("*");
      if (!error && data) {
        const produtosComImg = await Promise.all(
          data.map(async (p) => {
            const imgField = p.imagen ?? p.imagem ?? "";
            let resolved = "/placeholder.png";
            try {
              if (!imgField) resolved = "/placeholder.png";
              else if (
                typeof imgField === "string" &&
                (imgField.startsWith("http://") || imgField.startsWith("https://"))
              ) {
                resolved = decodeURI(imgField);
              } else {
                const { data: urlData } = supabase.storage
                  .from("imagen dos produtos")
                  .getPublicUrl(String(imgField));
                resolved = urlData?.publicUrl || "/placeholder.png";
              }
            } catch (e) {
              resolved = "/placeholder.png";
            }
            return { ...p, imagenResolved: resolved };
          })
        );
        setProdutos(produtosComImg);
      }
    }
    fetchProdutos();
  }, []);

  // Busca tipos do Supabase
  useEffect(() => {
    async function fetchTipos() {
      
      const { data, error } = await supabase.from("tipo").select("*");
      if (!error && data) setTipos(data);
      else console.log("Erro ao buscar tipos:", error);
    }
    fetchTipos();
  }, []);

  // Carrega usuário logado do localStorage
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuarioLogado) setUsuario(usuarioLogado);
  }, []);

  const filteredProdutos = produtos.filter((produto) =>
    (produto.nome || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(false), 200); // delay de 200ms
  };

  return (
    <nav className="bg-[#ECFFEB] shadow relative z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {/* LOGO + MENU */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Image src="/logo-agro.jpg" alt="Logo" width={150} height={150} className="rounded-full" />
          <Image src="/logo.png" alt="Logo" width={80} height={80} className="rounded-full" />

          {/* MENU PRINCIPAL */}
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-5 text-black">
            <li>
              <Link href="/" className="hover:text-green-700 font-medium">
                Início
              </Link>
            </li>

            {/* Dropdown Produtos */}
            <li
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <Link href="/produtos" className="hover:text-green-700 font-medium">
                Produtos
              </Link>

              {openDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute left-0 top-8 bg-white shadow-xl rounded-xl py-2 w-56"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  {tipos.map((tipo) => (
                    <Link
                      key={tipo.id}
                      href={`/produtos?tipo=${encodeURIComponent(tipo.nome_tipo)}`}
                      className="block px-4 py-2 hover:bg-green-100 text-gray-700"
                    >
                      {tipo.nome_tipo}
                    </Link>
                  ))}
                </motion.div>
              )}
            </li>

            <li>
              <Link href="https://itpetblog.com.br" className="hover:text-green-700 font-medium">
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
        </div>

        {/* ÍCONES À DIREITA */}
        <div className="flex items-center space-x-6 text-black">
          <Link href={usuario ? "/usuario" : "/login"} className="relative group flex items-center cursor-pointer">
            <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
              <User className="text-black w-6 h-6" />
            </div>
          </Link>

          <Link href="/carrinho" className="relative group flex items-center cursor-pointer">
            <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
              <ShoppingCart className="text-black w-6 h-6" />
            </div>
          </Link>

          <Link href="/contato" className="relative group flex items-center cursor-pointer">
            <div className="bg-white p-2 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110">
              <Mail className="text-black w-6 h-6" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
