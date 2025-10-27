"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../componentes/Navbar";
import Rodape from "../componentes/Rodape";
import BarraLateralCart from "../componentes/_BarraLateralCart";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabaseClient";

export default function ProdutosPage() {
  const { addToCart, setSidebarOpen } = useCart();
  const router = useRouter();
  const categoriaParam = decodeURIComponent(router.query.categoria || "");

  const urlToDBMap = {
    "Cães": "cachorro",
    "Gatos": "gato",
    "Aves/Passaros": "aves/passaros",
    "Casa & Jardim": "casa&jardim",
    "Outros Animais/Exóticos": "outros_animais/exoticos",
  };

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [filtros, setFiltros] = useState({
    categoria: categoriaParam ? [urlToDBMap[categoriaParam]] : [],
    tipo: [],
    preco: [],
  });
  const [loading, setLoading] = useState(true);

  const faixasPreco = [
    { id: "0-25", label: "Até R$ 25", min: 0, max: 25 },
    { id: "25-50", label: "R$ 25 - R$ 50", min: 25, max: 50 },
    { id: "50-100", label: "R$ 50 - R$ 100", min: 50, max: 100 },
    { id: "100+", label: "R$ 100+", min: 100, max: null },
  ];

  const handleAddToCart = (produto) => {
    addToCart({
      ...produto,
      imagem: produto.imagenResolved ? [produto.imagenResolved] : ["/placeholder.png"],
      quantity: 1,
    });
    setSidebarOpen(true);
  };

  useEffect(() => {
    async function fetchFiltros() {
      const { data: catData, error: catErr } = await supabase
        .from("categorias")
        .select("id, nome_cat");
      if (catErr) console.error("Erro categorias:", catErr);
      else setCategorias(catData || []);

      const { data: tipoData, error: tipoErr } = await supabase
        .from("tipo")
        .select("id, nome_tipo");
      if (tipoErr) console.error("Erro tipos:", tipoErr);
      else setTipos(tipoData || []);
    }
    fetchFiltros();
  }, []);

  useEffect(() => {
    async function fetchProdutos() {
      setLoading(true);
      let query = supabase.from("prod").select("*");

      if (filtros.categoria.length > 0) query = query.in("categorias", filtros.categoria);
      if (filtros.tipo.length > 0) query = query.in("tipo_prod", filtros.tipo);

      const { data, error } = await query;
      if (error) console.error("Erro produtos:", error);

      if (data) {
        const filtrados = filtros.preco.length > 0
          ? data.filter((p) =>
            filtros.preco.some((fId) => {
              const faixa = faixasPreco.find((f) => f.id === fId);
              if (!faixa) return false;
              if (faixa.max === null) return p.valor_venda >= faixa.min;
              return p.valor_venda >= faixa.min && p.valor_venda <= faixa.max;
            })
          )
          : data;

        const produtosComImgs = await Promise.all(
          filtrados.map(async (p) => {
            const imgField = p.imagen ?? p.imagem ?? "";
            let resolved = "/placeholder.png"; // fallback padrão

            try {
              if (typeof imgField === "string" && imgField.startsWith("http")) {
                resolved = decodeURI(imgField);
              } else if (imgField) {
                const { data: urlData } = supabase.storage
                  .from("imagen-dos-produtos")
                  .getPublicUrl(String(imgField));
                resolved = urlData?.publicUrl || "/placeholder.png";
              }
            } catch {
              resolved = "/placeholder.png";
            }

            // garante que o src seja sempre válido
            if (!resolved || resolved === "h") resolved = "/placeholder.png";

            return { ...p, imagenResolved: resolved };
          })
        );

        setProdutos(produtosComImgs);
      } else setProdutos([]);

      setLoading(false);
    }

    fetchProdutos();
  }, [filtros]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#ECFFEB] px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          {/* Barra lateral */}
          <aside className="w-full md:w-1/4 bg-white rounded-3xl shadow-lg p-6 h-fit sticky top-10">
            <h2 className="text-2xl font-bold mb-6 text-green-700">Filtrar Produtos</h2>

            <button
              className="text-sm text-red-500 mb-6 flex items-center gap-1 hover:underline transition"
              onClick={() => setFiltros({ categoria: [], tipo: [], preco: [] })}
            >
              Limpar filtros 🗑️
            </button>

            {/* Categorias */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {categorias.length === 0 ? <p className="text-gray-400">Carregando categorias...</p> :
                  categorias.map((cat) => {
                    const selected = filtros.categoria.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          const updated = selected
                            ? filtros.categoria.filter((id) => id !== cat.id)
                            : [...filtros.categoria, cat.id];
                          setFiltros({ ...filtros, categoria: updated });
                        }}
                        className={`px-3 py-1 rounded-full border transition font-medium ${selected ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"}`}
                      >
                        {cat.nome_cat}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Tipos */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Tipos</h3>
              <div className="flex flex-wrap gap-2">
                {tipos.length === 0 ? <p className="text-gray-400">Carregando tipos...</p> :
                  tipos.map((tipo) => {
                    const selected = filtros.tipo.includes(tipo.id);
                    return (
                      <button
                        key={tipo.id}
                        onClick={() => {
                          const updated = selected
                            ? filtros.tipo.filter((id) => id !== tipo.id)
                            : [...filtros.tipo, tipo.id];
                          setFiltros({ ...filtros, tipo: updated });
                        }}
                        className={`px-3 py-1 rounded-full border transition font-medium ${selected ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"}`}
                      >
                        {tipo.nome_tipo}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Faixa de preço */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Faixa de preço</h3>
              <div className="flex flex-wrap gap-2">
                {faixasPreco.map((f) => {
                  const selected = filtros.preco.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        const updated = selected
                          ? filtros.preco.filter((id) => id !== f.id)
                          : [...filtros.preco, f.id];
                        setFiltros({ ...filtros, preco: updated });
                      }}
                      className={`px-3 py-1 rounded-full border transition font-medium ${selected ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"}`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Lista de produtos */}
          <main className="flex-1">
            <h1 className="text-4xl font-bold mb-8 text-green-800">Produtos</h1>
            {loading ? <p>Carregando produtos...</p> :
              produtos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {produtos.map((produto, index) => (
                    <motion.div
                      key={produto.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4, type: "spring", stiffness: 100 }}
                      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition p-5 flex flex-col"
                    >
                      <Link href={`/produto/${produto.id_prod}`}>
                        <div className="relative w-full h-40 mb-4 cursor-pointer">
                          <Image
                            src={produto.imagenResolved?.startsWith("http") ? produto.imagenResolved : "/placeholder.png"}
                            alt={produto.nome || "Produto"}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </Link>

                      <h2 className="text-sm font-medium text-gray-700 line-clamp-2 h-10">{produto.nome}</h2>
                      <p className="text-lg font-bold text-green-700 mt-2">R$ {produto.valor_venda?.toFixed(2)}</p>
                      <button
                        onClick={() => handleAddToCart(produto)}
                        className="mt-4 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white rounded-full py-2 px-4 font-semibold transition-all transform hover:scale-105"
                      >
                        <Plus size={18} className="mr-2" /> Adicionar
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : <p className="text-gray-600">Nenhum produto encontrado.</p>
            }
          </main>
        </div>

        <Rodape />
      </div>

      <BarraLateralCart />
    </>
  );
}