import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { PwaBanner } from './components/layout/PwaBanner';
import { CommandPalette } from './components/layout/CommandPalette';
import { LandingPage } from './components/marketing/LandingPage';
import { PricingPage } from './components/marketing/PricingPage';
import { FeaturesPage } from './components/marketing/FeaturesPage';
import { ContactPage } from './components/marketing/ContactPage';
import { OtpLoginPage } from './components/auth/OtpLoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProductList } from './components/products/ProductList';
import { CreateProductWorkspace } from './components/products/CreateProductWorkspace';
import { ProductModal } from './components/products/ProductModal';
import { CsvImportModal } from './components/products/CsvImportModal';
import { QrStudio } from './components/qr/QrStudio';
import { ProductPassport } from './components/passport/ProductPassport';
import { PassportLoader } from './components/passport/PassportLoader';
import { PassportBuilder } from './components/passport/PassportBuilder';
import { EcosystemGraph } from './components/graph/EcosystemGraph';
import { CameraScanner } from './components/scanner/CameraScanner';
import { UseCaseExplorer } from './components/usecases/UseCaseExplorer';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { SubscriptionModal } from './components/billing/SubscriptionModal';
import { UserSubscriptionPage } from './components/billing/UserSubscriptionPage';
import { ContactSalesModal } from './components/marketing/ContactSalesModal';
import { DeveloperPortal } from './components/api/DeveloperPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ReportsPage } from './components/reports/ReportsPage';

import { Product, QrCodeRecord, ScanEvent, QrStylingConfig } from './types';
import { storage } from './services/storage';
import { SUBSCRIPTION_TIERS } from './data/mockData';
import { sound } from './services/audio';

import { FeatureExplorer } from './components/layout/FeatureExplorer';
import { VersionManagementModal } from './components/modals/VersionManagementModal';

export function App() {
  // Synchronize initial tab based on location URL
  const getInitialTab = () => {
    const path = window.location.pathname;
    // Public Marketing Site
    if (path === '/' || path === '/overview') return 'landing';
    if (path.startsWith('/use-cases')) return 'use-cases';
    if (path.startsWith('/features') || path.startsWith('/fetures')) return 'features';
    if (path.startsWith('/pricing')) return 'pricing';
    if (path.startsWith('/api-docs')) return 'api-docs';
    if (path.startsWith('/contact')) return 'contact';

    // Public QR Scan Resolver Gateway (dynamic realtime resolution)
    if (path.startsWith('/q/')) {
      const code = path.replace('/q/', '').trim();
      if (code.length > 0) return `passport-${code}`;
    }

    // Application Components (/app/*)
    if (path.startsWith('/app/builder')) return 'builder';
    if (path === '/app/inventory/create' || path.startsWith('/app/inventory/create') || path.startsWith('/app/product-inventory/create') || path.startsWith('/app/products/create')) return 'create-product';
    if (path.startsWith('/app/inventory') || path.startsWith('/app/product-inventory') || path.startsWith('/app/products')) return 'products';
    if (path.startsWith('/app/dashboard')) return 'dashboard';
    if (path.startsWith('/app/qr-studio') || path.startsWith('/app/studio')) return 'qr-studio';
    if (path.startsWith('/app/scanner')) return 'scanner';
    if (path.startsWith('/app/intelligance') || path.startsWith('/app/intelligence') || path.startsWith('/app/graph')) return 'graph';
    if (path.startsWith('/app/scan-analysis') || path.startsWith('/app/analytics')) return 'analytics';
    if (path.startsWith('/app/manage-api-keys') || path.startsWith('/app/keys')) return 'app-api-docs';
    if (path.startsWith('/app/admin')) return 'admin';
    if (path.startsWith('/app/reports')) return 'reports';
    if (path.startsWith('/app/subscription')) return 'billing';
    if (path.startsWith('/app/auth') || path.startsWith('/auth')) return 'auth';
    if (path.startsWith('/app')) return 'dashboard';

    return 'landing';
  };

  const [currentTab, setCurrentTabState] = useState<string>(getInitialTab);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('uniqr_auth_token'));

  const handleLogout = () => {
    localStorage.removeItem('uniqr_auth_token');
    localStorage.removeItem('uniqr_user');
    setIsAuthenticated(false);
    setCurrentTab('landing');
  };

  const setCurrentTab = (tab: string) => {
    setCurrentTabState(tab);
    if (tab === 'landing') {
      window.history.pushState({}, '', '/');
    } else if (tab === 'use-cases') {
      window.history.pushState({}, '', '/use-cases');
    } else if (tab === 'features') {
      window.history.pushState({}, '', '/features');
    } else if (tab === 'pricing') {
      window.history.pushState({}, '', '/pricing');
    } else if (tab === 'api-docs') {
      window.history.pushState({}, '', '/api-docs');
    } else if (tab === 'contact') {
      window.history.pushState({}, '', '/contact');
    } else if (tab === 'auth' || tab === 'login') {
      window.history.pushState({}, '', '/app/auth');
    } else if (tab === 'builder') {
      window.history.pushState({}, '', '/app/builder');
    } else if (tab === 'create-product' || tab === 'create-entity') {
      window.history.pushState({}, '', '/app/inventory/create');
    } else if (tab === 'products' || tab === 'inventory') {
      window.history.pushState({}, '', '/app/inventory');
    } else if (tab === 'dashboard') {
      window.history.pushState({}, '', '/app/dashboard');
    } else if (tab === 'qr-studio' || tab === 'studio') {
      window.history.pushState({}, '', '/app/qr-studio');
    } else if (tab === 'scanner') {
      window.history.pushState({}, '', '/app/scanner');
    } else if (tab === 'graph' || tab === 'intelligance') {
      window.history.pushState({}, '', '/app/intelligance');
    } else if (tab === 'analytics' || tab === 'scan-analysis') {
      window.history.pushState({}, '', '/app/scan-analysis');
    } else if (tab === 'app-api-docs' || tab === 'api') {
      window.history.pushState({}, '', '/app/manage-api-keys');
    } else if (tab === 'admin') {
      window.history.pushState({}, '', '/app/admin');
    } else if (tab === 'reports') {
      window.history.pushState({}, '', '/app/reports');
    } else if (tab === 'billing') {
      window.history.pushState({}, '', '/app/subscription');
    } else if (tab.startsWith('passport-')) {
      const code = tab.replace('passport-', '');
      window.history.pushState({}, '', `/q/${code}`);
    } else {
      window.history.pushState({}, '', '/app/dashboard');
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentTabState(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [qrRecords, setQrRecords] = useState<QrCodeRecord[]>([]);
  const [scans, setScans] = useState<ScanEvent[]>([]);
  const [subscription, setSubscription] = useState<any>({});
  
  // Selected product for QR Studio
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isContactSalesModalOpen, setIsContactSalesModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);
  const [isCapabilityGuideOpen, setIsCapabilityGuideOpen] = useState<boolean>(false);

  // Load data from Storage
  const refreshData = () => {
    setProducts(storage.getProducts());
    setQrRecords(storage.getQrRecords());
    setScans(storage.getScans());
    setSubscription(storage.getSubscription());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const currentTier = SUBSCRIPTION_TIERS.find(t => t.id === subscription.planId) || SUBSCRIPTION_TIERS[0];
  const quotaLimit = currentTier.id === 'free' ? (currentTier.lifetimeCap || 10) : (currentTier.qrLimitDaily || 50);
  const quotaUsed = subscription.totalLifetimeGenerated || 0;

  // Save product handler
  const handleSaveProduct = (prod: Product) => {
    storage.saveProduct(prod);
    refreshData();
    sound.playSuccessChime();
  };

  // Clone product handler (1-click duplicate)
  const handleCloneProduct = (original: Product) => {
    sound.playSuccessChime();
    const clonedToken = `UQ-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
    const cloned: Product = {
      ...JSON.parse(JSON.stringify(original)),
      id: `prod-clone-${Date.now()}`,
      name: `${original.name} (Copy)`,
      uniqrCode: clonedToken,
      identityNumber: original.identityNumber ? `${original.identityNumber}-COPY` : clonedToken,
      sku: original.sku ? `${original.sku}-COPY` : '',
      serialNumber: `SN-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingProduct(cloned);
    setCurrentTab('create-product');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product identity?')) {
      storage.deleteProduct(id);
      refreshData();
    }
  };

  // Bulk CSV import handler
  const handleCsvImportSuccess = (imported: Product[]) => {
    imported.forEach(p => storage.saveProduct(p));
    refreshData();
    sound.playSuccessChime();
    alert(`Successfully imported ${imported.length} products into repository!`);
  };

  // Generate QR Record handler
  const handleGenerateQrRecord = (product: Product, config: QrStylingConfig) => {
    try {
      storage.createQrRecord(product, config);
      refreshData();
    } catch (err: any) {
      if (err.message === 'FREE_LIMIT_REACHED') {
        setIsUpgradeModalOpen(true);
      }
    }
  };

  // Check if viewing a public passport target — use PassportLoader for dynamic resolution
  if (currentTab.startsWith('passport-')) {
    const rawCode = currentTab.replace('passport-', '');
    const code = rawCode.split('?')[0].split('/')[0].trim();
    
    if (code.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);

      return (
        <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] flex flex-col justify-between selection:bg-[#1D4533] selection:text-[#F7EAE0]">
          <PassportLoader
            qrCode={code}
            urlParams={searchParams}
            localProducts={products}
            onBackToApp={() => setCurrentTab('dashboard')}
          />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] flex flex-col selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* PWA Install Notification Banner */}
      <PwaBanner currentTab={currentTab} />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenCapabilityGuide={() => setIsCapabilityGuideOpen(prev => !prev)}
        onOpenVersionModal={() => setIsVersionModalOpen(true)}
        onOpenContactSales={() => setIsContactSalesModalOpen(true)}
        quotaUsed={quotaUsed}
        quotaLimit={quotaLimit}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Interactive Platform Capability Guide */}
      {(currentTab === 'dashboard' || isCapabilityGuideOpen) && (
        <FeatureExplorer
          forceOpen={isCapabilityGuideOpen}
          onClose={() => setIsCapabilityGuideOpen(false)}
          onOpenNewProduct={() => {
            setEditingProduct(null);
            setCurrentTab('create-product');
          }}
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      )}

      {/* Main View Container */}
      {currentTab === 'landing' ? (
        <LandingPage
          onLaunchApp={() => setCurrentTab('dashboard')}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          onOpenContactSales={() => setIsContactSalesModalOpen(true)}
          setCurrentTab={setCurrentTab}
        />
      ) : currentTab === 'features' ? (
        <FeaturesPage
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenContactSales={() => setIsContactSalesModalOpen(true)}
        />
      ) : currentTab === 'contact' ? (
        <ContactPage
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenContactSales={() => setIsContactSalesModalOpen(true)}
        />
      ) : currentTab === 'pricing' ? (
        <PricingPage
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          onOpenContactSales={() => setIsContactSalesModalOpen(true)}
        />
      ) : currentTab === 'use-cases' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <UseCaseExplorer />
        </main>
      ) : currentTab === 'api-docs' || currentTab === 'api' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <DeveloperPortal />
        </main>
      ) : currentTab === 'auth' || (!isAuthenticated && currentTab !== 'landing' && currentTab !== 'use-cases' && currentTab !== 'features' && currentTab !== 'pricing' && currentTab !== 'api-docs' && currentTab !== 'contact' && !currentTab.startsWith('passport-')) ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <OtpLoginPage onLoginSuccess={() => {
            setIsAuthenticated(true);
            setCurrentTab('dashboard');
          }} />
        </main>
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto flex">
          
          {/* Desktop Sidebar */}
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />

          {/* App Screen Contents */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            {currentTab.startsWith('passport-') && (() => {
              const code = currentTab.replace('passport-', '');
              const matchedProduct = products.find(p => p.uniqrCode === code || p.id === code) || products[0];
              return <ProductPassport product={matchedProduct} onBackToApp={() => setCurrentTab('products')} />;
            })()}

            {currentTab === 'dashboard' && (
              <Dashboard
                products={products}
                qrRecords={qrRecords}
                scans={scans}
                quotaUsed={quotaUsed}
                quotaLimit={quotaLimit}
                setCurrentTab={setCurrentTab}
                onOpenNewProduct={() => {
                  setEditingProduct(null);
                  setCurrentTab('create-product');
                }}
                onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
                onSelectProductForQr={(p) => {
                  setSelectedProduct(p);
                  setCurrentTab('qr-studio');
                }}
              />
            )}

            {currentTab === 'use-cases' && (
              <UseCaseExplorer />
            )}

            {currentTab === 'products' && (
              <ProductList
                products={products}
                onOpenNewProduct={() => {
                  setEditingProduct(null);
                  setCurrentTab('create-product');
                }}
                onOpenCsvImport={() => setIsCsvImportOpen(true)}
                onEditProduct={(p) => {
                  setEditingProduct(p);
                  setCurrentTab('create-product');
                }}
                onCloneProduct={handleCloneProduct}
                onDeleteProduct={handleDeleteProduct}
                onSelectProductForQr={(p) => {
                  setSelectedProduct(p);
                  setCurrentTab('qr-studio');
                }}
                onOpenPassport={(code) => setCurrentTab(`passport-${code}`)}
              />
            )}

            {currentTab === 'create-product' && (
              <CreateProductWorkspace
                productToEdit={editingProduct}
                onSave={(prod) => {
                  handleSaveProduct(prod);
                  setCurrentTab('products');
                }}
                onCancel={() => setCurrentTab('products')}
              />
            )}

            {currentTab === 'qr-studio' && (
              <QrStudio
                products={products}
                selectedProduct={selectedProduct}
                onGenerateSuccess={() => refreshData()}
                onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
                quotaUsed={quotaUsed}
                quotaLimit={quotaLimit}
              />
            )}

            {currentTab === 'scanner' && (
              <CameraScanner
                onScanSuccess={(code) => setCurrentTab(`passport-${code}`)}
              />
            )}

            {currentTab === 'graph' && (
              <EcosystemGraph
                products={products}
                scans={scans}
                onNavigateToScanAnalysis={() => setCurrentTab('analytics')}
                onNavigateToReports={() => setCurrentTab('reports')}
                onNavigateToPassports={() => setCurrentTab('builder')}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsDashboard
                scans={scans}
                products={products}
                onNavigateToReports={() => setCurrentTab('reports')}
                onOpenPassport={(code) => setCurrentTab(`passport-${code}`)}
              />
            )}

            {currentTab === 'billing' && (
              <UserSubscriptionPage
                quotaUsed={quotaUsed}
                quotaLimit={quotaLimit}
                currentTierName={currentTier.name}
                onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
                onLogout={handleLogout}
              />
            )}

            {(currentTab === 'app-api-docs' || currentTab === 'api') && (
              <DeveloperPortal />
            )}

            {currentTab === 'reports' && (
              <ReportsPage />
            )}

            {currentTab === 'admin' && (
              <AdminPortal />
            )}

            {currentTab === 'builder' && (
              <PassportBuilder
                products={products}
                onSave={() => refreshData()}
              />
            )}
          </main>
        </div>
      )}

      {/* Mobile Bottom Floating Navigation — Application screens only */}
      {!['landing', 'use-cases', 'features', 'pricing', 'api-docs', 'contact'].includes(currentTab) && !currentTab.startsWith('passport-') && (
        <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
      )}

      {/* Modals & Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setCurrentTab={setCurrentTab}
        onOpenNewProduct={() => {
          setEditingProduct(null);
          setCurrentTab('create-product');
        }}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={(prod) => {
          handleSaveProduct(prod);
          setIsProductModalOpen(false);
        }}
        initialProduct={editingProduct}
      />

      <CsvImportModal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
        onImportSuccess={handleCsvImportSuccess}
      />

      <SubscriptionModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onSuccessUpgrade={() => refreshData()}
        onOpenContactSales={() => setIsContactSalesModalOpen(true)}
      />

      <ContactSalesModal
        isOpen={isContactSalesModalOpen}
        onClose={() => setIsContactSalesModalOpen(false)}
      />

      <VersionManagementModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
      />

    </div>
  );
}
