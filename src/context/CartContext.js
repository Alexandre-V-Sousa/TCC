// context/CartContext.js
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // carregar do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart:v1");
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.warn("Erro ao ler cart do localStorage", e);
    }
  }, []);

  // persistir no localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart:v1", JSON.stringify(items));
    } catch (e) {
      console.warn("Erro ao salvar cart no localStorage", e);
    }
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p))
        .filter(Boolean)
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clear, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}
