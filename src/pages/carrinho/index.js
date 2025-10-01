// CarrinhoPage.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Navbar from "../../componentes/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function CarrinhoPage() {
  const { cartItems, updateQuantity, removeItem, subtotal, clearCart, addToCart } = useCart();
  const [cep, setCep] = useState("");
  const [cupom, setCupom] = useState("");
  const [cupomMsg, setCupomMsg] = useState(null);
  const [frete, setFrete] = useState(null);
  const [recomendados, setRecomendados] = useState([]);
  const [loading, setLoading] = useState(true);

  const format = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const applyCep = () => {
    if (!cep.match(/^\d{5}-?\d{3}$/)) {
      setFrete(null);
      alert("Digite um CEP válido (00000-000).");
      return;
    }
    const n = Number(cep.replace(/\D/g, "").slice(0, 2));
    setFrete(n % 2 === 0 ? 0 : 12.5);
  };

  const applyCupom = () => {
    if (cupom.trim().toUpperCase() === "FIX10") {
      setCupomMsg("Cupom aplicado: 10% off");
    } else {
      setCupomMsg("Cupom inválido");
    }
  };

  const total = (() => {
    let base = subtotal;
    if (cupom.trim().toUpperCase() === "FIX10") base *= 0.9;
    if (frete) base += frete;
    return base;
  })();

  // Buscar produtos recomendados
  useEffect(() => {
    async function fetchRecomendados() {
      setLoading(true);
      const { data, error } = await supabase.from("prod").select("*").limit(4);

      if (!error && data) {
        const produtosComUrl = await Promise.all(
          data.map(async (p) => {
            const imgField = p.imagen ?? p.imagem ?? "";
            let resolved = "/placeholder.png";

            try {
              if (!imgField) {
                resolved = "/placeholder.png";
              } else if (typeof imgField === "string" && (imgField.startsWith("http://") || imgField.startsWith("https://"))) {
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
            } catch {
              resolved = "/placeholder.png";
            }

            return { ...p, imagenResolved: resolved };
          })
        );

        setRecomendados(produtosComUrl);
      }

      setLoading(false);
    }

    fetchRecomendados();
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-[#ECFFEB] min-h-screen py-10 px-4 text-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Conteúdo principal - carrinho */}
          <section className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-md">
            <h1 className="text-2xl font-bold mb-4">Carrinho</h1>
            {cartItems.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                Sua sacola está vazia.{" "}
                <Link href="/">Voltar ao catálogo</Link>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id_prod}-${item.nome}`}
                      className="border rounded-lg p-4 flex flex-col md:flex-row gap-4"
                    >
                      <div className="w-full md:w-28 h-28 relative bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                        {item.imagem && item.imagem[0] && (
                          <Image
                            src={item.imagem[0]}
                            alt={item.nome}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{item.nome}</p>
                          {item.variant && (
                            <p className="text-sm text-gray-500">{item.variant}</p>
                          )}
                          <p className="mt-2 text-sm text-gray-600">
                            R$ {(item.valor_venda || item.preco || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id_prod,
                                  item.nome,
                                  (item.quantity || 1) - 1
                                )
                              }
                              className="border rounded px-3 py-2 hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <div className="px-3 py-2 border rounded min-w-[48px] text-center">
                              {item.quantity || 1}
                            </div>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id_prod,
                                  item.nome,
                                  (item.quantity || 1) + 1
                                )
                              }
                              className="border rounded px-3 py-2 hover:bg-gray-100"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              onClick={() => removeItem(item.id_prod, item.nome)}
                              className="ml-4 text-red-500 hover:text-red-700"
                            >
                              <Trash2 />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Total</div>
                            <div className="font-semibold">
                              {format(
                                (item.valor_venda || item.preco || 0) *
                                  (item.quantity || 1)
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={clearCart}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Limpar sacola
                  </button>
                  <div className="text-sm text-gray-600">{cartItems.length} itens</div>
                </div>
              </>
            )}
          </section>

          {/* Resumo + Recomendações */}
          <aside className="lg:col-span-4 space-y-6">
            {/* CEP */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block text-sm font-medium text-gray-700">
                Qual o CEP?
              </label>
              <div className="flex gap-2 mt-2">
                <input
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  className="flex-1 border rounded px-3 py-2 focus:outline-none"
                />
                <button
                  onClick={applyCep}
                  className="bg-gray-800 text-white px-4 rounded"
                >
                  Aplicar
                </button>
              </div>
            </div>

            {/* Cupom */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <label className="block text-sm font-medium text-gray-700">
                Cupom de desconto
              </label>
              <div className="flex gap-2 mt-2">
                <input
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  placeholder="Digite seu cupom"
                  className="flex-1 border rounded px-3 py-2 focus:outline-none"
                />
                <button
                  onClick={applyCupom}
                  className="bg-gray-800 text-white px-4 rounded"
                >
                  Aplicar
                </button>
              </div>
              {cupomMsg && (
                <p className="text-sm mt-2 text-green-600">{cupomMsg}</p>
              )}
            </div>

            {/* Resumo final */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Valor dos produtos</span>
                <span>{format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Frete</span>
                <span>
                  {frete == null
                    ? "Calcule o CEP"
                    : frete === 0
                    ? "Grátis"
                    : format(frete)}
                </span>
              </div>
              <div className="flex justify-between mt-4 items-end">
                <div>
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-2xl font-bold">{format(total)}</div>
                </div>
                <button className="bg-[#0b57a4] hover:bg-[#084e8f] text-white px-6 py-3 rounded-lg">
                  Ir para pagamento
                </button>
              </div>
            </div>

            {/* Recomendações dinâmicas */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="font-semibold mb-4">Recomendações</h3>
              {loading ? (
                <p>Carregando recomendações...</p>
              ) : recomendados.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {recomendados.map((produto) => (
                    <div key={produto.id_prod} className="border rounded p-2 flex flex-col items-center">
                      <div className="w-20 h-20 relative bg-gray-50 rounded overflow-hidden">
                        <Image
                          src={produto.imagenResolved || "/placeholder.png"}
                          alt={produto.nome}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <p className="text-xs mt-2 text-center line-clamp-2">{produto.nome}</p>
                      <p className="text-sm font-semibold">R$ {produto.valor_venda.toFixed(2)}</p>
                      <button
                        onClick={() => addToCart({ ...produto, imagem: [produto.imagenResolved], quantity: 1 })}
                        className="mt-2 text-xs bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
                      >
                        Adicionar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum produto recomendado.</p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
