"use client";
import { motion } from "framer-motion";
import { X, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";

export default function BarraLateralCart() {
  const {
    cartItems = [],
    removeItem,
    clearCart,
    isSidebarOpen,
    setSidebarOpen,
    updateQuantity,
  } = useCart();

  const router = useRouter();

  // Subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.valor_venda || item.preco || 0) * (item.quantity || 1),
    0
  );

  useEffect(() => {
    const handleRouteChange = () => setSidebarOpen(false);
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router, setSidebarOpen]);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isSidebarOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
      className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="text-lg font-bold text-gray-800">Confira sua compra</h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      {/* Itens do carrinho */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-6">Seu carrinho está vazio</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={`${item.id_prod}-${item.nome}`}
              className="flex items-center gap-3 border-b pb-3"
            >
              {item.imagem && item.imagem[0] && (
                <Image
                  src={item.imagem[0]}
                  alt={item.nome}
                  width={60}
                  height={60}
                  className="rounded-md object-contain"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.nome}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity}x R$ {(item.valor_venda || item.preco || 0).toFixed(2)}
                </p>

                {/* Botões de quantidade */}
                <div className="flex items-center gap-2 mt-1 text-black">
                  <button
                    onClick={() =>
                      updateQuantity(item.id_prod, item.nome, item.quantity - 1)
                    }
                    className="p-1 rounded-full bg-gray-200 hover:bg-black/30 text-black"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-2 text-black">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id_prod, item.nome, item.quantity + 1)
                    }
                    className="p-1 rounded-full bg-gray-200 hover:bg-black/30 text-black"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id_prod, item.nome)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="flex justify-between font-bold text-gray-800">
          Subtotal: <span>R$ {subtotal.toFixed(2)}</span>
        </p>
        <Link
          href="/carrinho"
          onClick={() => setSidebarOpen(false)}
          className="block text-center bg-green-700 hover:bg-green-800 text-white py-3 mt-4 rounded-xl font-medium"
        >
          Ir para sacola
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="w-full text-gray-600 mt-2 text-sm underline"
        >
          Voltar
        </button>
      </div>
    </motion.div>
  );
}
