"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "woodie_cart_v1";

export function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]); 
  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product, qty = 1) => {
    if (!product?.id) return;

    setItems((prev) => {
      const exist = prev.find((x) => x.id === product.id);
      if (exist) {
        return prev.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          oldPrice: product.oldPrice,
          img: product.img,
          qty,
        },
      ];
    });

    openCart();
  };

  const removeItem = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  const setQty = (id, qty) => {
    const safeQty = Math.max(1, qty || 1);
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty: safeQty } : x)));
  };

  const inc = (id) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));
  const dec = (id) =>
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))
    );

  const clearCart = () => setItems([]);

  const count = useMemo(
    () => items.reduce((sum, x) => sum + (x.qty || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.qty, 0),
    [items]
  );

  const value = {
    isOpen,
    openCart,
    closeCart,
    items,
    addToCart,
    removeItem,
    setQty,
    inc,
    dec,
    clearCart,
    count,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
