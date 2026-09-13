import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  CreditCard, 
  AlertCircle,
  X,
  Percent,
  CheckCircle2,
  PackageOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';

export default function PosTerminal() {
  const { 
    products, 
    categories, 
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
    storeInfo,
    setIsPaymentModalOpen 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [discountType, setDiscountType] = useState('nominal'); // 'nominal' | 'percent'
  const [discountInput, setDiscountInput] = useState('');

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.barcode && p.barcode.includes(searchQuery));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleApplyDiscount = () => {
    const val = Number(discountInput) || 0;
    if (discountType === 'percent') {
      const nominal = Math.round((cartSubtotal * Math.min(100, Math.max(0, val))) / 100);
      setCartDiscount(nominal);
    } else {
      setCartDiscount(Math.min(cartSubtotal, Math.max(0, val)));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Product Catalog (7 or 8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          {/* Search bar & Category filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama barang, kode SKU, atau scan barcode..."
                className="w-full pl-11 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({products.length})
              </button>
              {categories.map(cat => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-700">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian lain atau ganti filter kategori.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredProducts.map(product => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock <= product.minStock;
                const inCart = cart.find(c => c.id === product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => !isOutOfStock && addToCart(product)}
                    className={`group bg-white rounded-2xl border p-3.5 flex flex-col justify-between transition-all duration-150 relative select-none ${
                      isOutOfStock 
                        ? 'opacity-60 border-slate-200 bg-slate-50 cursor-not-allowed' 
                        : 'border-slate-200/90 hover:border-emerald-500 hover:shadow-md cursor-pointer active:scale-[0.98]'
                    }`}
                  >
                    {/* Top badging */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {product.sku}
                      </span>
                      {isOutOfStock ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          Habis
                        </span>
                      ) : isLowStock ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center space-x-1">
                          <span>Sisa {product.stock}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500">
                          Stok: {product.stock} {product.unit}
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <div className="mb-3">
                      <h4 className="font-semibold text-sm text-slate-800 group-hover:text-emerald-600 line-clamp-2 leading-snug">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{product.categoryName}</p>
                    </div>

                    {/* Price & Add button */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-xs text-slate-400 block leading-none">Harga</span>
                        <span className="font-bold text-sm text-slate-900">
                          {formatRupiah(product.sellPrice)}
                        </span>
                      </div>
                      
                      {inCart ? (
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {inCart.qty}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-500 text-slate-600 group-hover:text-white flex items-center justify-center transition-colors">
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Cart Sidebar (5 or 4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col h-[calc(100vh-6.5rem)]">
            
            {/* Cart Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Keranjang Kasir</h3>
                  <p className="text-xs text-slate-400">{cartItemsCount} item dipilih</p>
                </div>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan</span>
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="font-semibold text-slate-600">Keranjang Masih Kosong</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Klik produk di katalog sebelah kiri untuk menambahkannya ke transaksi.
                  </p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </h5>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                        <span>{formatRupiah(item.price)}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{formatRupiah(item.price * item.qty)}</span>
                      </div>
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => updateCartQty(item.id, item.qty - 1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-slate-800">{item.qty}</span>
                      <button
                        onClick={() => updateCartQty(item.id, item.qty + 1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Calculations & Checkout */}
            {cart.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl space-y-3">
                
                {/* Discount Accordion/Input */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="Diskon (Rp)"
                      value={cartDiscount > 0 ? cartDiscount : ''}
                      onChange={(e) => setCartDiscount(Math.max(0, Number(e.target.value)))}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  {cartDiscount > 0 && (
                    <button
                      onClick={() => setCartDiscount(0)}
                      className="text-xs text-slate-400 hover:text-slate-600 px-1"
                    >
                      Batal
                    </button>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">{formatRupiah(cartSubtotal)}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Potongan Diskon</span>
                      <span>-{formatRupiah(cartDiscount)}</span>
                    </div>
                  )}
                  {storeInfo.taxEnabled && (
                    <div className="flex justify-between">
                      <span>PPN ({storeInfo.taxRate}%)</span>
                      <span className="font-semibold text-slate-800">{formatRupiah(cartTax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-slate-900">
                    <span className="font-bold text-sm">Total Bayar</span>
                    <span className="font-extrabold text-xl text-emerald-600">{formatRupiah(cartTotal)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Bayar Sekarang ({formatRupiah(cartTotal)})</span>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
