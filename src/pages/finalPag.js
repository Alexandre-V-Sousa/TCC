"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../componentes/Navbar";

let QRCode;
try {
  QRCode = require("qrcode");
} catch (e) {
  QRCode = null;
}

export default function FinalPag() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useCart();
  const [usuario, setUsuario] = useState(null);
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [error, setError] = useState(null);

  // Estado seguro para cupom e frete
  const [cupom, setCupom] = useState("");
  const [freteUsuario, setFreteUsuario] = useState(0);

  const serviceFee = 5.9;

  useEffect(() => {
    if (typeof window === "undefined") return; // só rodar no cliente

    // Pegar cupom e frete
    const c = localStorage.getItem("cupom") || "";
    const f = Number(localStorage.getItem("frete")) || 0;
    setCupom(c);
    setFreteUsuario(f);

    const fetchUsuario = async () => {
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
      if (!usuarioLogado) {
        router.push("/login");
        return;
      }

      // Buscar dados completos no Supabase
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id_user", usuarioLogado.id_user)
        .single();

      if (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        alert("Erro ao carregar dados do usuário.");
        router.push("/login");
        return;
      }

      setUsuario(data);

      // Checar carrinho vazio
      const ultimoPedido = JSON.parse(localStorage.getItem("ultimoPedidoFake"));
      if (!ultimoPedido && (!cartItems || cartItems.length === 0)) {
        alert("Seu carrinho está vazio!");
        router.push("/produtos");
      }
    };

    fetchUsuario();
  }, [router, cartItems]);

  if (!usuario) return <p className="text-center mt-10 text-black">Carregando usuário...</p>;

  // Calcular valor dos produtos considerando PATINHAOFF
  let produtosValor = Number(subtotal || 0);
  if (cupom === "PATINHAOFF") produtosValor = 0;

  const totalValue = (produtosValor + serviceFee + freteUsuario).toFixed(2);

  const normalizeCard = (num) => String(num).replace(/\s|-/g, "");
  const isMagicCard = (num) => normalizeCard(num) === "4242424242424242";

  const gerarQR = async (payload) => {
    try {
      if (!QRCode) QRCode = (await import("qrcode")).default;
      return await QRCode.toDataURL(String(payload), { errorCorrectionLevel: "M", margin: 1, width: 400 });
    } catch (err) {
      console.error("Erro gerando QR:", err);
      setError("Não foi possível gerar QR code.");
      return null;
    }
  };

  const handlePayCard = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      setError("Preencha todos os campos do cartão.");
      setLoading(false);
      return;
    }
    if (isMagicCard(cardData.number)) {
      const pedido = {
        id: "ORD-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
        method: "cartao_falso",
        card_masked: "**** **** **** " + normalizeCard(cardData.number).slice(-4),
        amount: totalValue,
        items: cartItems,
        user: usuario,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("ultimoPedidoFake", JSON.stringify(pedido));
      clearCart && clearCart();
      setLoading(false);
      router.push("/sucesso");
      return;
    }
    setTimeout(() => {
      setError("Pagamento recusado. Use o cartão de teste fornecido.");
      setLoading(false);
    }, 800);
  };

  const handlePayPix = async () => {
    setLoading(true);
    const payload = [
      "00PAY.FAKE",
      `order:${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      `amount:${totalValue}`,
      `to:${usuario.email || usuario.nome || "cliente"}`,
    ].join("|");
    const dataUrl = await gerarQR(payload);
    const pedido = {
      id: "ORD-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
      method: "pix_falso",
      amount: totalValue,
      items: cartItems,
      user: usuario,
      created_at: new Date().toISOString(),
      pix_payload: payload,
      qrDataUrl: dataUrl,
    };
    localStorage.setItem("ultimoPedidoFake", JSON.stringify(pedido));
    clearCart && clearCart();
    setLoading(false);
    router.push("/sucesso");
  };

  const handlePayCash = () => {
    setLoading(true);
    const pedido = {
      id: "ORD-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
      method: "dinheiro_falso",
      amount: totalValue,
      items: cartItems,
      user: usuario,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem("ultimoPedidoFake", JSON.stringify(pedido));
    clearCart && clearCart();
    setTimeout(() => {
      setLoading(false);
      router.push("/sucesso");
    }, 500);
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#ECFFEB] min-h-screen p-6 md:p-12 text-black">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Dados do usuário */}
            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-black">Seus dados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Nome", name: "nome" },
                  { label: "Email", name: "email" },
                  { label: "Telefone", name: "telefone" },
                  { label: "CEP", name: "CEP" },
                  { label: "Endereço", name: "logradouro" },
                  { label: "Número", name: "numero" },
                  { label: "Bairro", name: "bairro" },
                  { label: "Cidade", name: "cidade" },
                ].map((it) => (
                  <div key={it.name} className="flex flex-col">
                    <label className="text-sm font-medium">{it.label}</label>
                    <input
                      type="text"
                      value={usuario[it.name] || ""}
                      disabled
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-black"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Produtos no carrinho */}
            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-black">Produtos no carrinho</h2>
              <div className="divide-y max-h-80 overflow-y-auto">
                {cartItems.map((item, i) => {
                  const preco = Number(String(item.valor_venda || item.valor || item.price || 0).replace("R$", "").replace(",", ".").trim());
                  return (
                    <div key={i} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Image src={item.imagem?.[0] || "/sem-imagem.png"} alt={item.nome} width={64} height={64} className="rounded border" />
                        <div>
                          <p className="font-medium text-black">{item.nome}</p>
                          <p className="text-sm text-black">Qtd: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-black">R$ {(preco * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Resumo e métodos de pagamento */}
          <aside className="bg-white p-6 rounded-2xl shadow-md space-y-4 text-black">
            <h3 className="text-lg font-semibold">Resumo do pedido</h3>
            <div className="text-sm">
              <p>{usuario.nome}</p>
              <p>{usuario.logradouro}, {usuario.numero}</p>
              <p>{usuario.bairro} - {usuario.cidade}/{usuario.estado}</p>
              <p>CEP: {usuario.CEP}</p>
            </div>

            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Valor dos produtos</span><span>R$ {produtosValor.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Taxa de serviço</span><span>R$ {serviceFee.toFixed(2)}</span></div>
              <div className="flex justify-between font-medium">
                <span>Entrega</span>
                <span>{freteUsuario ? `R$ ${freteUsuario.toFixed(2)}` : "Grátis"}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>R$ {totalValue}</span></div>
            </div>

            <div className="mt-2">
              <label className="text-sm font-medium block mb-2">Escolha o método</label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setMethod("card")} className={`py-2 rounded-lg ${method === "card" ? "bg-blue-700 text-white" : "bg-gray-100 text-black"}`}>Cartão</button>
                <button onClick={() => setMethod("pix")} className={`py-2 rounded-lg ${method === "pix" ? "bg-blue-700 text-white" : "bg-gray-100 text-black"}`}>PIX</button>
                <button onClick={() => setMethod("cash")} className={`py-2 rounded-lg ${method === "cash" ? "bg-blue-700 text-white" : "bg-gray-100 text-black"}`}>Dinheiro</button>
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            {method === "card" && (
              <form onSubmit={handlePayCard} className="space-y-3 mt-3">
                <input
                  placeholder="Número do cartão (ex: 4242 4242 4242 4242)"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  className="w-full p-2 border rounded text-black"
                />
                <input
                  placeholder="Nome (no cartão)"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="w-full p-2 border rounded text-black"
                />
                <div className="flex gap-2">
                  <input
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    className="w-1/2 p-2 border rounded text-black"
                  />
                  <input
                    placeholder="CVV"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    className="w-1/2 p-2 border rounded text-black"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-2 rounded mt-2">
                  {loading ? "Processando..." : "Pagar com cartão"}
                </button>
              </form>
            )}

            {method === "pix" && (
              <button onClick={handlePayPix} disabled={loading} className="w-full bg-green-600 text-white py-2 rounded mt-3">
                {loading ? "Gerando QR..." : "Pagar com PIX"}
              </button>
            )}

            {method === "cash" && (
              <button onClick={handlePayCash} disabled={loading} className="w-full bg-yellow-500 text-black py-2 rounded mt-3">
                {loading ? "Finalizando..." : "Pagar em dinheiro"}
              </button>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
