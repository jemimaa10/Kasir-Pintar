import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import PosTerminal from './components/PosTerminal';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import SupplierManagement from './components/SupplierManagement';
import SalesReports from './components/SalesReports';
import PaymentModal from './components/PaymentModal';
import ReceiptModal from './components/ReceiptModal';
import SettingsModal from './components/SettingsModal';

function MainLayout() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'pos' && <PosTerminal />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'suppliers' && <SupplierManagement />}
        {activeTab === 'reports' && <SalesReports />}
      </main>

      {/* Global Modals */}
      <PaymentModal />
      <ReceiptModal />
      <SettingsModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© 2026 Kasir Pintar UMKM — Sistem Point of Sale & Inventaris Web.</p>
          <p className="flex items-center space-x-1">
            <span>Dirancang untuk kemudahan & produktivitas UMKM Indonesia.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
