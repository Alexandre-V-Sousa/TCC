import "@/styles/globals.css";
import { CartProvider, useCart } from "../context/CartContext";
import BarraLateralCart from "../componentes/_BarraLateralCart";
import { useState } from "react";

function Layout({ Component, pageProps }) {
  const { cartItems, removeItem, updateQuantity, clearCart } = useCart();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Component
        {...pageProps}
        openCart={() => setSidebarOpen(true)}
      />
      <BarraLateralCart
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        cartItems={cartItems}
        removeItem={removeItem}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
      />
    </>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Layout Component={Component} pageProps={pageProps} />
    </CartProvider>
  );
}
