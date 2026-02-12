// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Constants for shipping and tax rates
  const SHIPPING_COST = 7.00; // Fixed shipping cost of 7 TND
  const TAX_RATE = 0; // 18% VAT tax rate

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('tawakkol_cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Validate cart structure
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('tawakkol_cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tawakkol_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    // Validate product structure
    if (!product?._id || !product?.name || !product?.price) {
      console.error('Invalid product structure:', product);
      throw new Error('Invalid product data');
    }

    setCart((prev) => {
      // Find existing item with same ID, size, and color
      const existingItemIndex = prev.findIndex(
        (item) =>
          item._id === product._id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedCart = [...prev];
        const existingItem = updatedCart[existingItemIndex];
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity
        };
        return updatedCart;
      } else {
        // Add new item
        const newItem = {
          _id: product._id,
          name: product.name,
          price: product.price,
          mainImage: product.mainImage,
          quantity: quantity,
          selectedSize: selectedSize,
          selectedColor: selectedColor,
          // Include additional product data if needed
          description: product.description,
          category: product.category,
          stock: product.stock,
          // Unique identifier for this specific variant
          variantKey: `${product._id}-${selectedSize || 'nosize'}-${selectedColor || 'nocolor'}`,
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (productId, size = null, color = null) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item._id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const updateQuantity = (productId, quantity, size = null, color = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item._id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('tawakkol_cart');
  };

  // Calculate cart metrics - MEMOIZED for performance
  const cartCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [cart]
  );

  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  
  // FIXED: Tax is now properly included in total
  const total = useMemo(() => subtotal + SHIPPING_COST );
  
  const totalNoTax = useMemo(() => subtotal + SHIPPING_COST, [subtotal]);

  // Utility functions
  const isInCart = useCallback((productId, size = null, color = null) => {
    return cart.some(item => 
      item._id === productId &&
      item.selectedSize === size &&
      item.selectedColor === color
    );
  }, [cart]);

  const getItem = useCallback((productId, size = null, color = null) => {
    return cart.find(item => 
      item._id === productId &&
      item.selectedSize === size &&
      item.selectedColor === color
    );
  }, [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    shippingCost: SHIPPING_COST,
    tax,
    total, // Now correctly includes tax: subtotal + 7 TND shipping + tax
    totalNoTax, // subtotal + 7 TND shipping only
    isCartOpen,
    setIsCartOpen,
    isInCart,
    getItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};