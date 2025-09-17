// pages/carrinho.js
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, subtotal, clear } = useCart();
  const [cep, setCep] = useState("");
  const [cupom, setCupom] = useState("");
  const [cupomMsg, setCupomMsg] = useState(null);
  const [frete, setFrete] = useState(null);

  const format = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const applyCep = () => {
    // MOCK: calcula frete fixo por cep (substituir por API)
    if (!cep.match(/^\d{5}-?\d{3}$/)) {
      setFrete(null);
      alert("Digite um CEP válido (00000-000).");
      return;
    }
    // valor de exemplo por faixa
    const n = Number(cep.replace(/\D/g, "").slice(0, 2));
    const valor = n % 2 === 0 ? 0 : 12.5;
    setFrete(valor);
  };

  const applyCupom = () => {
    // MOCK: cupom FIX10 dá 10% off
    if (cupom.trim().toUpperCase() === "FIX10") {
      setCupomMsg("Cupom aplicado: 10% off");
    } else {
      setCupomMsg("Cupom inválido");
    }
  };

  const total = (() => {
    let base = subtotal;
    if (cupom.trim().toUpperCase() === "FIX10") base = base * 0.9;
    if (frete) base += frete;
    return base;
  })();

  return (
    <main className="bg-[#ECFFEB] min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Conteúdo principal */}
        <section className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold mb-4">Sacola</h1>

          {items.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              Sua sacola está vazia. <Link href="/">Voltar ao catálogo</Link>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {items.map((it) => (
                  <div key={it.id} className="border rounded-lg p-4 flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-28 h-28 relative bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={it.img} alt={it.name} fill style={{ objectFit: "contain" }} />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{it.name}</p>
                        {it.variant && <p className="text-sm text-gray-500">{it.variant}</p>}
                        <p className="mt-2 text-sm text-gray-600">R$ {it.price.toFixed(2)}</p>
                      </div>

                      <div className="mt-4 md:mt-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(it.id, it.quantity - 1)}
                            className="border rounded px-3 py-2 hover:bg-gray-100"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="px-3 py-2 border rounded min-w-[48px] text-center">{it.quantity}</div>
                          <button
                            onClick={() => updateQuantity(it.id, it.quantity + 1)}
                            className="border rounded px-3 py-2 hover:bg-gray-100"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(it.id)}
                            className="ml-4 text-red-500 hover:text-red-700"
                          >
                            <Trash2 />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-500">Total</div>
                          <div className="font-semibold">{format(it.price * it.quantity)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={() => clear()} className="text-sm text-blue-600 hover:underline">
                  Limpar sacola
                </button>
                <div className="text-sm text-gray-600">{items.length} itens</div>
              </div>
            </>
          )}
        </section>

        {/* Resumo à direita */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <label className="block text-sm font-medium text-gray-700">Qual o CEP?</label>
            <div className="flex gap-2 mt-2">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
                className="flex-1 border rounded px-3 py-2 focus:outline-none"
              />
              <button onClick={applyCep} className="bg-gray-800 text-white px-4 rounded">
                Aplicar
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Cupom de desconto</label>
              <div className="flex gap-2 mt-2">
                <input
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  placeholder="Digite seu cupom"
                  className="flex-1 border rounded px-3 py-2 focus:outline-none"
                />
                <button onClick={applyCupom} className="bg-gray-800 text-white px-4 rounded">
                  Aplicar
                </button>
              </div>
              {cupomMsg && <p className="text-sm mt-2 text-green-600">{cupomMsg}</p>}
            </div>

            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Valor dos produtos</span>
                <span>{format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Frete</span>
                <span>{frete == null ? "Calcule o CEP" : frete === 0 ? "Grátis" : format(frete)}</span>
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
          </div>

          {/* Formas de pagamento e contato */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Formas de pagamento</div>
              <div className="flex gap-3 items-center">
                {/* Coloque as imagens dos meios de pagamento na pasta public/payments */}
                <Image src="/payments/mastercard.png" width={48} height={30} alt="Mastercard" />
                <Image src="/payments/visa.png" width={48} height={30} alt="Visa" />
                <Image src="/payments/amex.png" width={48} height={30} alt="Amex" />
                <Image src="/payments/elo.png" width={48} height={30} alt="Elo" />
                <Image src="/payments/pix.png" width={48} height={30} alt="Pix" />
              </div>
            </div>

            <div className="border-t pt-4 text-sm text-gray-600">
              <div className="mb-2">Tem alguma dúvida?</div>
              <div>(11) 3434-6980 · Atendimento</div>
            </div>
          </div>

          {/* Recomendações */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold mb-4">Recomendações</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Substitua com produtos reais */}
              <div className="border rounded p-2 flex flex-col items-center">
                <div className="w-20 h-20 relative bg-gray-50 rounded overflow-hidden">
                  <Image src="/recommend/prod1.png" alt="rec1" fill style={{ objectFit: "contain" }} />
                </div>
                <p className="text-xs mt-2 text-center">Produto 1</p>
                <p className="text-sm font-semibold">R$ 19,90</p>
              </div>

              <div className="border rounded p-2 flex flex-col items-center">
                <div className="w-20 h-20 relative bg-gray-50 rounded overflow-hidden">
                  <Image src="/recommend/prod2.png" alt="rec2" fill style={{ objectFit: "contain" }} />
                </div>
                <p className="text-xs mt-2 text-center">Produto 2</p>
                <p className="text-sm font-semibold">R$ 12,90</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
