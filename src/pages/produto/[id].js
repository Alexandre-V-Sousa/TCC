"use client";

import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Navbar from "../../componentes/Navbar";
import Rodape from "../../componentes/Rodape";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProdutoPage() {
  const params = useParams();
  const id = params?.id;

  const { addToCart, setSidebarOpen } = useCart();
  const [produto, setProduto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [quantidade, setQuantidade] = useState(1);

  const SUPABASE_BASE = "https://kdqjnyhhxbafdhgwpzhq.supabase.co";
  const DEFAULT_BUCKET = "imagem dos produtos";
  const DEFAULT_BUCKET_ENCODED = encodeURIComponent(DEFAULT_BUCKET);
  const placeholder = "/placeholder.png";

  const corrigirImagem = (raw) => {
    if (!raw || raw === "h") return placeholder;

    let url = raw;
    if (Array.isArray(raw)) url = raw[0];
    if (typeof url === "object") return placeholder;

    if (url.includes(",")) {
      const parts = url.split(",").map((s) => s.trim()).filter(Boolean);
      url = parts.length > 0 ? parts[0] : url;
    }

    if (url.startsWith("http://") || url.startsWith("https://")) return url;

    if (url.startsWith("/storage") || url.includes("/object/public/")) {
      const cleaned = url.startsWith("/") ? url : `/${url}`;
      return `${SUPABASE_BASE}${cleaned}`;
    }

    if (url.includes("/")) return `${SUPABASE_BASE}/storage/v1/object/public/${url}`;

    return `${SUPABASE_BASE}/storage/v1/object/public/${DEFAULT_BUCKET_ENCODED}/${encodeURIComponent(url)}`;
  };

  useEffect(() => {
    if (!id) return;

    const idNum = Number(id);

    const fetchProduto = async () => {
      try {
        const { data, error } = await supabase
          .from("prod")
          .select("*")
          .eq("id_prod", idNum)
          .maybeSingle();

        if (error || !data) {
          setProduto(null);
          return;
        }

        let imagens = [];
        if (data.imagem) {
          if (typeof data.imagem === "string" && data.imagem.includes(",")) {
            imagens = data.imagem
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map(corrigirImagem);
          } else {
            imagens = [corrigirImagem(data.imagem)];
          }
        } else if (data.imagens && Array.isArray(data.imagens)) {
          imagens = data.imagens.map(corrigirImagem);
        } else {
          imagens = [placeholder];
        }

        setProduto({
          ...data,
          preco: data.valor_venda || 0,
          imagens,
          categoria: data.categoria || data.categorias || "Sem categoria",
        });
      } catch (err) {
        console.error(err);
        setProduto(null);
      }
    };

    const fetchRelacionados = async () => {
      try {
        const { data, error } = await supabase
          .from("prod")
          .select("*")
          .neq("id_prod", idNum)
          .limit(10);

        if (!error && data) {
          const list = data.map((p) => {
            let imgs = [];
            if (p.imagem) {
              if (typeof p.imagem === "string" && p.imagem.includes(",")) {
                imgs = p.imagem
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map(corrigirImagem);
              } else {
                imgs = [corrigirImagem(p.imagem)];
              }
            } else if (p.imagens && Array.isArray(p.imagens)) {
              imgs = p.imagens.map(corrigirImagem);
            } else {
              imgs = [placeholder];
            }

            return {
              ...p,
              preco: p.valor_venda || 0,
              imagens: imgs,
              categoria: p.categoria || p.categorias || "Sem categoria",
            };
          });
          setRelacionados(list);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduto();
    fetchRelacionados();
  }, [id]);

  if (!produto) return <p className="p-10">Carregando produto...</p>;

  const handleAddToCart = () => {
    const produtoParaCarrinho = {
      ...produto,
      // ⚡ CORREÇÃO: barra lateral espera `imagem` (singular)
      imagem: produto.imagens && produto.imagens.length > 0 ? produto.imagens : [placeholder],
      preco: produto.preco ?? produto.valor_venda ?? 0,
      quantity: quantidade,
    };
    addToCart(produtoParaCarrinho);
    setSidebarOpen(true);
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#ECFFEB] min-h-screen px-6 py-14 text-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Galeria */}
          <div className="lg:col-span-5 space-y-6">
            {produto.imagens.length > 0 && (
              <motion.div
                key={imagemAtiva}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-96 bg-white rounded-3xl shadow-lg overflow-hidden"
              >
                <Image
                  src={produto.imagens[imagemAtiva] || placeholder}
                  alt={produto.nome || "Produto"}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </motion.div>
            )}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {produto.imagens.map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setImagemAtiva(i)}
                  className={`w-24 h-24 flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition ${
                    i === imagemAtiva ? "ring-2 ring-green-600" : ""
                  }`}
                >
                  <Image
                    src={img || placeholder}
                    alt={`${produto.nome} ${i}`}
                    width={100}
                    height={100}
                    className="object-contain w-full h-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-extrabold text-green-800 mb-4"
            >
              {produto.nome}
            </motion.h1>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-green-100 text-green-800 font-bold text-3xl px-6 py-4 rounded-2xl shadow-md inline-block mb-6"
            >
              R$ {(produto.preco ?? produto.valor_venda ?? 0).toFixed(2)}
            </motion.div>

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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex items-center justify-center bg-green-700 hover:bg-green-800 text-white rounded-full py-3 px-8 font-semibold shadow-lg"
            >
              <Plus size={22} className="mr-2" /> Adicionar ao Carrinho
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-12 bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-xl font-semibold mb-4 text-green-700">Descrição</h2>
              <p className="text-gray-700 leading-relaxed">{produto.descricao}</p>
            </motion.div>
          </div>
        </div>

        {/* Relacionados */}
        <section className="max-w-7xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-green-800 mb-6">Produtos relacionados</h2>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
              {relacionados.map((rel) => (
                <motion.div
                  key={rel.id_prod}
                  whileHover={{ scale: 1.05 }}
                  className="snap-start bg-white rounded-2xl shadow-lg p-4 min-w-[220px] cursor-pointer"
                  onClick={() => window.location.href = `/produto/${rel.id_prod}`}
                >
                  {rel.imagens.length > 0 && (
                    <Image
                      src={rel.imagens[0] || placeholder}
                      alt={rel.nome}
                      width={160}
                      height={160}
                      className="rounded-lg object-contain mx-auto"
                    />
                  )}
                  <p className="mt-3 text-sm font-medium text-gray-700 text-center">{rel.nome}</p>
                  <p className="text-green-700 font-bold text-center">R$ {(rel.preco ?? rel.valor_venda ?? 0).toFixed(2)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Rodape />
      </main>
    </>
  );
}
