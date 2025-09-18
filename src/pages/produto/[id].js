"use client";
import { useRouter } from "next/router";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion";
import { Star, Plus, ChevronLeft, ChevronRight, Minus } from "lucide-react";
import Navbar from "../../componentes/Navbar";
import Image from "next/image";
import { useState } from "react";

const produtosFicticios = [
  {
    id: 1,
    nome: "Ração Premium para Cães Adultos 10kg",
    preco: 159.9,
    imagem: [
      "/cachorro/RaçãoCachorro.jpg",
      "/cachorro/BrinquedosCachorro.jpg",
      "/cachorro/PetiscoCachorro.jpg",
    ],
    categoria: "Alimentação",
    marca: "Golden",
    descricao:
      "Ração premium para cães adultos, com vitaminas, minerais e proteínas balanceadas para saúde e energia.",
    especificacoes: {
      peso: "10kg",
      sabor: "Carne & Vegetais",
      indicado: "Cães Adultos",
      validade: "12 meses",
    },
  },
  {
    id: 2,
    nome: "Areia Higiênica para Gatos 4kg",
    preco: 39.9,
    imagem: [
      "/gato/AreiaGatos.jpg",
      "/gato/HigieneGato.jpg",
      "/gato/CatLitter.jpg",
    ],
    categoria: "Higiene",
    marca: "Pipicat",
    descricao:
      "Areia higiênica de alta absorção, controla odores e facilita a limpeza da caixa de areia.",
    especificacoes: {
      peso: "4kg",
      aroma: "Neutro",
      indicado: "Gatos de todas as idades",
      absorcao: "99%",
    },
  },
  {
    id: 3,
    nome: "Brinquedo Mordedor para Cães",
    preco: 29.9,
    imagem: ["/cachorro/BrinquedosCachorro.jpg", "/cachorro/BrinquedoBola.jpg"],
    categoria: "Brinquedos",
    marca: "PetFun",
    descricao:
      "Brinquedo mordedor resistente, ideal para cães de médio e grande porte, ajuda na saúde dental.",
    especificacoes: {
      material: "Borracha atóxica",
      tamanho: "15cm",
      indicado: "Cães de porte médio/grande",
      durabilidade: "Alta",
    },
  },
];

export default function ProdutoPage() {
  const router = useRouter();
  const { id } = router.query;
  const produto = produtosFicticios.find((p) => p.id === Number(id));

  const { addToCart, setSidebarOpen } = useCart();
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [quantidade, setQuantidade] = useState(1);

  if (!produto) return <p className="p-10">Produto não encontrado.</p>;

  const handleAddToCart = () => {
    addToCart({ ...produto, quantidade }); // adiciona a quantidade selecionada
    setSidebarOpen(true);
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#ECFFEB] min-h-screen px-6 py-14 text-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Galeria de imagens */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              key={imagemAtiva}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-96 bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <Image
                src={produto.imagem[imagemAtiva]}
                alt={produto.nome}
                fill
                style={{ objectFit: "contain" }}
              />
            </motion.div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {produto.imagem.map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setImagemAtiva(i)}
                  className={`w-24 h-24 flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition ${
                    i === imagemAtiva ? "ring-2 ring-green-600" : ""
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${produto.nome} ${i}`}
                    width={100}
                    height={100}
                    className="object-contain w-full h-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Informações principais */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-extrabold text-green-800 mb-4"
            >
              {produto.nome}
            </motion.h1>

            <p className="text-sm text-gray-500 mb-6">
              Categoria: {produto.categoria} • Marca: {produto.marca}
            </p>

            {/* Avaliações fake */}
            <div className="flex items-center gap-1 text-yellow-500 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
              <span className="ml-2 text-sm text-gray-600">120 avaliações</span>
            </div>

            {/* Preço */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-green-100 text-green-800 font-bold text-3xl px-6 py-4 rounded-2xl shadow-md inline-block mb-6"
            >
              R$ {produto.preco.toFixed(2)}
            </motion.div>

            {/* Seletor de quantidade */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition"
              >
                <Minus size={20} />
              </button>
              <span className="font-medium text-lg">{quantidade}</span>
              <button
                onClick={() => setQuantidade((q) => q + 1)}
                className="bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Botão adicionar ao carrinho */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex items-center justify-center bg-green-700 hover:bg-green-800 text-white rounded-full py-3 px-8 font-semibold shadow-lg"
            >
              <Plus size={22} className="mr-2" /> Adicionar ao Carrinho
            </motion.button>

            {/* Descrição */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-12 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-xl font-semibold mb-4 text-green-700">
                Descrição
              </h2>
              <p className="text-gray-700 leading-relaxed">{produto.descricao}</p>
            </motion.div>

            {/* Especificações */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-xl font-semibold mb-4 text-green-700">
                Especificações
              </h2>
              <ul className="space-y-2 text-gray-700">
                {Object.entries(produto.especificacoes).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-medium capitalize">{key}:</span> {value}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Produtos relacionados */}
        <section className="max-w-7xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Produtos relacionados
          </h2>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
              {produtosFicticios
                .filter((p) => p.id !== produto.id)
                .map((rel) => (
                  <motion.div
                    key={rel.id}
                    whileHover={{ scale: 1.05 }}
                    className="snap-start bg-white rounded-2xl shadow-lg p-4 min-w-[220px] cursor-pointer"
                    onClick={() => router.push(`/produto/${rel.id}`)}
                  >
                    <Image
                      src={rel.imagem[0]}
                      alt={rel.nome}
                      width={160}
                      height={160}
                      className="rounded-lg object-contain mx-auto"
                    />
                    <p className="mt-3 text-sm font-medium text-gray-700 text-center">
                      {rel.nome}
                    </p>
                    <p className="text-green-700 font-bold text-center">
                      R$ {rel.preco.toFixed(2)}
                    </p>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
