"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Carrega do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  // Salva no localStorage sempre que o carrinho muda
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Gera chave única do produto
  const getKey = (product) => `${product.id_prod}-${product.nome}`;

  // Adicionar produto ao carrinho (respeita quantity)
  const addToCart = (product) => {
    const key = getKey(product);
    setCartItems((prev) => {
      const existing = prev.find((item) => getKey(item) === key);
      if (existing) {
        return prev.map((item) =>
          getKey(item) === key
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    setSidebarOpen(true);
  };

  // Remover item
  const removeItem = (id, nome) => {
    setCartItems((prev) =>
      prev.filter((item) => getKey(item) !== `${id}-${nome}`)
    );
  };

  // Limpar carrinho
  const clearCart = () => setCartItems([]);

  // Atualizar quantidade manualmente
  const updateQuantity = (id, nome, quantity) => {
    if (quantity <= 0) {
      removeItem(id, nome);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        getKey(item) === `${id}-${nome}` ? { ...item, quantity } : item
      )
    );
  };

  // Subtotal
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + (item.valor_venda || item.preco || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        clearCart,
        updateQuantity,
        subtotal,
        isSidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
