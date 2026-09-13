import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_SUPPLIERS, 
  INITIAL_STORE_INFO, 
  INITIAL_TRANSACTIONS 
} from '../data/initialData';
import { generateTrxCode } from '../utils/formatters';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Storage Helpers
  const loadLocal = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error('Failed to load ' + key, e);
      return fallback;
    }
  };

  const [activeTab, setActiveTab] = useState('pos'); // 'pos', 'dashboard', 'products', 'suppliers', 'reports'
  const [products, setProducts] = useState(() => loadLocal('kasir_products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState(() => loadLocal('kasir_categories', INITIAL_CATEGORIES));
  const [suppliers, setSuppliers] = useState(() => loadLocal('kasir_suppliers', INITIAL_SUPPLIERS));
  const [transactions, setTransactions] = useState(() => loadLocal('kasir_transactions', INITIAL_TRANSACTIONS));
  const [storeInfo, setStoreInfo] = useState(() => loadLocal('kasir_storeInfo', INITIAL_STORE_INFO));
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [cartDiscount, setCartDiscount] = useState(0); // discount in Rupiah
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('kasir_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kasir_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('kasir_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('kasir_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kasir_storeInfo', JSON.stringify(storeInfo));
  }, [storeInfo]);

  // Product CRUD
  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: 'p-' + Date.now(),
      stock: Number(newProduct.stock) || 0,
      buyPrice: Number(newProduct.buyPrice) || 0,
      sellPrice: Number(newProduct.sellPrice) || 0,
      minStock: Number(newProduct.minStock) || 5,
    };
    setProducts(prev => [product, ...prev]);
    return product;
  };

  const updateProduct = (id, updated) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const adjustStock = (productId, deltaQty, reason = 'Penyesuaian manual') => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextStock = Math.max(0, p.stock + deltaQty);
        return { ...p, stock: nextStock };
      }
      return p;
    }));
  };

  // Supplier & Restock
  const addSupplier = (newSup) => {
    const sup = { ...newSup, id: 'sup-' + Date.now() };
    setSuppliers(prev => [...prev, sup]);
  };

  const updateSupplier = (id, updated) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteSupplier = (id) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const recordPurchase = (supplierId, items, invoiceNo = '', notes = '') => {
    // items: [{ productId, qty, buyPrice }]
    items.forEach(item => {
      adjustStock(item.productId, Number(item.qty), 'Stok Masuk: ' + invoiceNo);
      // optionally update buyPrice if changed
      if (item.buyPrice) {
        updateProduct(item.productId, { buyPrice: Number(item.buyPrice) });
      }
    });
  };

  // Category CRUD
  const addCategory = (name, icon = 'Package', color = 'emerald') => {
    const cat = { id: 'cat-' + Date.now(), name, icon, color };
    setCategories(prev => [...prev, cat]);
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Cart operations
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert('Maaf, stok barang ini sedang habis!');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          alert('Jumlah melebihi stok yang tersedia (' + product.stock + ')');
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      } else {
        return [...prev, {
          id: product.id,
          sku: product.sku,
          name: product.name,
          unit: product.unit,
          price: product.sellPrice,
          buyPrice: product.buyPrice,
          stock: product.stock,
          qty: 1
        }];
      }
    });
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    const prod = products.find(p => p.id === productId);
    if (prod && newQty > prod.stock) {
      alert('Jumlah melebihi sisa stok (' + prod.stock + ')');
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
  };

  // Calculate cart totals
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartTax = storeInfo.taxEnabled ? Math.round((cartSubtotal - cartDiscount) * (storeInfo.taxRate / 100)) : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartTax);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Complete Transaction
  const completeTransaction = ({ paymentMethod, paidAmount, customerName = 'Pelanggan Umum' }) => {
    if (cart.length === 0) return null;

    const changeAmount = Math.max(0, paidAmount - cartTotal);
    
    // Calculate total profit
    const totalProfit = cart.reduce((acc, item) => {
      const itemProfit = (item.price - (item.buyPrice || 0)) * item.qty;
      return acc + itemProfit;
    }, 0) - cartDiscount;

    const trx = {
      id: 'trx-' + Date.now(),
      code: generateTrxCode(),
      date: new Date().toISOString(),
      customerName: customerName || 'Pelanggan Umum',
      cashier: storeInfo.cashierName || 'Kasir 01',
      items: cart.map(item => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        unit: item.unit,
        price: item.price,
        buyPrice: item.buyPrice,
        qty: item.qty,
        subtotal: item.price * item.qty
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      tax: cartTax,
      total: cartTotal,
      paymentMethod, // 'cash', 'qris', 'transfer'
      paidAmount,
      changeAmount,
      totalProfit
    };

    // 1. Deduct product stock
    setProducts(prev => prev.map(p => {
      const inCart = cart.find(c => c.id === p.id);
      if (inCart) {
        return { ...p, stock: Math.max(0, p.stock - inCart.qty) };
      }
      return p;
    }));

    // 2. Save transaction
    setTransactions(prev => [trx, ...prev]);

    // 3. Clear cart & show receipt
    clearCart();
    setCurrentReceipt(trx);
    setIsPaymentModalOpen(false);
    setIsReceiptModalOpen(true);

    return trx;
  };

  // Reset to default data
  const resetToDefault = () => {
    if (confirm('Kembalikan semua data ke demo awal? Data yang baru diubah akan di-reset.')) {
      setProducts(INITIAL_PRODUCTS);
      setCategories(INITIAL_CATEGORIES);
      setSuppliers(INITIAL_SUPPLIERS);
      setTransactions(INITIAL_TRANSACTIONS);
      setStoreInfo(INITIAL_STORE_INFO);
      clearCart();
    }
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      categories,
      addCategory,
      deleteCategory,
      suppliers,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      recordPurchase,
      transactions,
      storeInfo,
      setStoreInfo,
      cart,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      cartDiscount,
      setCartDiscount,
      cartSubtotal,
      cartTax,
      cartTotal,
      cartItemsCount,
      completeTransaction,
      currentReceipt,
      setCurrentReceipt,
      isPaymentModalOpen,
      setIsPaymentModalOpen,
      isReceiptModalOpen,
      setIsReceiptModalOpen,
      isSettingsModalOpen,
      setIsSettingsModalOpen,
      resetToDefault
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
