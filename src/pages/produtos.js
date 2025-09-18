// pages/produtos.js
"use client";
import { useCart } from "../context/CartContext";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../componentes/Navbar";
import BarraLateralCart from "../componentes/_BarraLateralCart";

const produtosFicticios = [
  {
    id: 1,
    nome: "Ração Premium para Cães Adultos 10kg",
    preco: 159.9,
    imagem: "/cachorro/RaçãoCachorro.jpg",
    categoria: "Alimentação",
    marca: "Golden",
  },
  {
    id: 2,
    nome: "Areia Higiênica para Gatos 4kg",
    preco: 39.9,
    imagem: "/gato/AreiaGatos.jpg",
    categoria: "Acessórios",
    marca: "Pipicat",
  },
  {
    id: 3,
    nome: "Coleira Antipulgas para Cães e Gatos",
    preco: 89.9,
    imagem: "/cachorro/ColeirasCachorro.jpg",
    categoria: "Farmácia",
    marca: "Frontline",
  },
  {
    id: 4,
    nome: "Brinquedo Bola Mordedor para Cães",
    preco: 24.9,
    imagem: "/cachorro/BrinquedosCachorro.jpg",
    categoria: "Brinquedos",
    marca: "Chalesco",
  },
];

export default function ProdutosPage() {
  const { addToCart, setSidebarOpen } = useCart();

  const handleAddToCart = (produto) => {
    addToCart(produto);
    setSidebarOpen(true); // abre a barra lateral ao adicionar
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#ECFFEB] px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          {/* Sidebar de filtros */}
          <aside className="w-full md:w-1/4 bg-white rounded-3xl shadow-lg p-6 h-fit sticky top-10">
            <h2 className="text-2xl font-bold mb-6 text-green-700">Filtrar Produtos</h2>
            <button className="text-sm text-red-500 mb-8 flex items-center gap-1 hover:underline transition">
              Limpar filtros 🗑️
            </button>

            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Categorias</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><input type="checkbox" className="mr-2" /> Alimentação</li>
                <li><input type="checkbox" className="mr-2" /> Acessórios</li>
                <li><input type="checkbox" className="mr-2" /> Brinquedos</li>
                <li><input type="checkbox" className="mr-2" /> Farmácia</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Faixa de Preço</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><input type="checkbox" className="mr-2" /> Até R$ 25</li>
                <li><input type="checkbox" className="mr-2" /> R$ 25 - R$ 50</li>
                <li><input type="checkbox" className="mr-2" /> R$ 50 - R$ 100</li>
                <li><input type="checkbox" className="mr-2" /> R$ 100+</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Marcas</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><input type="checkbox" className="mr-2" /> Golden</li>
                <li><input type="checkbox" className="mr-2" /> Pipicat</li>
                <li><input type="checkbox" className="mr-2" /> Frontline</li>
                <li><input type="checkbox" className="mr-2" /> Chalesco</li>
              </ul>
            </div>
          </aside>

          {/* Grid de produtos */}
          <main className="flex-1">
            <h1 className="text-4xl font-bold mb-8 text-green-800">Produtos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {produtosFicticios.map((produto, index) => (
                <motion.div
                  key={produto.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition p-5 flex flex-col"
                >
                  <div className="relative w-full h-40 mb-4">
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <h2 className="text-sm font-medium text-gray-700 line-clamp-2 h-10">
                    {produto.nome}
                  </h2>

                  <p className="text-lg font-bold text-green-700 mt-2">
                    R$ {produto.preco.toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleAddToCart(produto)}
                    className="mt-4 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white rounded-full py-2 px-4 font-semibold transition-all transform hover:scale-105"
                  >
                    <Plus size={18} className="mr-2" /> Adicionar
                  </button>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Barra lateral de carrinho */}
      <BarraLateralCart />
    </>
  );
}
