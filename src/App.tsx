/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceCategories } from './components/ServiceCategories';
import { EverythingGrid } from './components/EverythingGrid';
import { PartnersBanner } from './components/PartnersBanner';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { MobileSimulator } from './components/MobileSimulator';
import { ActiveOrderTracker } from './components/ActiveOrderTracker';
import { AdminConsole } from './components/AdminConsole';
import { DriverPartnerApp } from './components/DriverPartnerApp';
import { MerchantHub } from './components/MerchantHub';
import { ClientPitchModal } from './components/ClientPitchModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AiErrandAssistantModal } from './components/AiErrandAssistantModal';
import { AuthModal } from './components/AuthModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { AuthService } from './services/authService';
import { 
  ServiceType, 
  ActiveBooking, 
  AppRole, 
  WhiteLabelConfig, 
  UserProfile,
  PaymentGatewayTransaction 
} from './types';
import { 
  Smartphone, 
  Monitor, 
  Columns, 
  Car, 
  Store, 
  ShieldCheck, 
  Sparkles, 
  FileText,
  Building2,
  Check,
  CreditCard
} from 'lucide-react';

export default function App() {
  // Commercial & White-Label Configuration State
  const [config, setConfig] = useState<WhiteLabelConfig>({
    appName: 'ErrandX',
    tagline: 'One app. Every local errand in your town.',
    townName: 'Your Town',
    city: 'Your Town',
    currencySymbol: '₹',
    platformFeePercent: 5,
    surgeMultiplier: 1.0,
    taxGstPercent: 5,
    baseFare: 25,
    extraStopFee: 15,
    zoneFees: {
      townCentre: 10,
      nearby: 25,
      outskirts: 45
    }
  });

  // Authentication & Unified User Account State
  const [authUser, setAuthUser] = useState<UserProfile | null>(() => AuthService.getSessionUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Active Role Portal State
  const [currentRole, setCurrentRole] = useState<AppRole>(() => 
    authUser?.activeRole === 'partner' ? 'driver' : 'customer'
  );
  
  // Customer View State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiFallbackMessage, setAiFallbackMessage] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>('groceries');
  const [showSimulator, setShowSimulator] = useState(true);
  const [viewMode, setViewMode] = useState<'dual' | 'web' | 'mobile'>('dual');
  
  // Payment Gateway State
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [gatewayAmount, setGatewayAmount] = useState<number>(65);
  const [gatewayOrderTitle, setGatewayOrderTitle] = useState<string>('Errand Dispatch & Task Escrow');
  const [gatewayOrderId, setGatewayOrderId] = useState<string>('ORD-78190');
  const [pendingBookingToDispatch, setPendingBookingToDispatch] = useState<ActiveBooking | null>(null);

  // Commercial Modals
  const [isClientPitchOpen, setIsClientPitchOpen] = useState(false);
  const [invoiceBooking, setInvoiceBooking] = useState<ActiveBooking | null>(null);

  // Wallet & Bookings State
  const [walletBalance, setWalletBalance] = useState<number>(() => authUser?.walletBalance || 750);
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([
    {
      id: 'TSK-84920',
      serviceType: 'groceries',
      serviceName: 'GROCERIES',
      title: `Provisions & Milk Run (${config.townName})`,
      status: 'in_transit',
      driverName: 'Local Task Partner',
      driverPhone: '+91 98401 23456',
      driverRating: 4.95,
      vehicleNumber: 'Two-Wheeler Partner',
      otp: '5831',
      eta: 12,
      totalAmount: 65,
      pickupLocation: `Sample Grocery Store, Market Street, ${config.townName}`,
      dropLocation: `Home, College Road, ${config.townName}`,
      stops: [
        { id: 's1', location: `Sample Grocery Store, Market Street, ${config.townName}`, instruction: 'Pick up 1L fresh milk and provisions', status: 'done', type: 'pickup' },
        { id: 's2', location: `Home, College Road, ${config.townName}`, instruction: 'Deliver to home doorstep', status: 'pending', type: 'drop' }
      ],
      currentStopIndex: 1,
      timestamp: 'Today, 10:15 AM',
      customerName: authUser?.name || 'Demo Resident',
      customerPhone: authUser?.phone || '+91 98765 43210',
      paymentMethod: 'CASH ON DELIVERY (DEFAULT)',
      itemsList: [
        { id: 'it-1', text: 'Fresh Milk', quantity: '1 Litre', completed: true },
        { id: 'it-2', text: 'Daily Provisions', quantity: '1 Bag', completed: false }
      ],
      priceBreakdown: {
        baseFare: 25,
        zoneName: 'Town Centre (Flat In-Town)',
        zoneFee: 10,
        distanceKm: 1.5,
        distanceRate: 10,
        extraStopsCount: 0,
        extraStopsFee: 0,
        complexityFee: 0,
        urgencySurcharge: 0,
        platformFee: 3,
        gstTax: 3,
        subtotal: 35,
        totalEstimatedPrice: 65,
        isPriceLocked: true
      }
    }
  ]);
  const [trackedBooking, setTrackedBooking] = useState<ActiveBooking | null>(null);

  // Authentication Handlers
  const handleAuthSuccess = (user: UserProfile) => {
    setAuthUser(user);
    setWalletBalance(user.walletBalance);
    if (user.activeRole === 'partner') {
      setCurrentRole('driver');
    } else {
      setCurrentRole('customer');
    }
  };

  const handleLogout = () => {
    AuthService.clearSession();
    setAuthUser(null);
  };

  const handleSwitchRole = (newRole: 'customer' | 'partner') => {
    if (authUser) {
      const updated = AuthService.switchRole(authUser, newRole);
      setAuthUser(updated);
    }
    setCurrentRole(newRole === 'partner' ? 'driver' : 'customer');
  };

  const handleOpenBooking = (service: ServiceType = 'ride') => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleOpenAiAssistant = () => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsAiAssistantOpen(true);
  };

  // Called when user completes the booking form
  const handleBookingConfirmed = (newBooking: ActiveBooking, preferredPayment?: 'gateway' | 'wallet' | 'cash') => {
    if (preferredPayment === 'cash') {
      const finalBooking: ActiveBooking = {
        ...newBooking,
        paymentMethod: 'CASH ON ARRIVAL'
      };
      setActiveBookings((prev) => [finalBooking, ...prev]);
      setTrackedBooking(finalBooking);
      return;
    }

    // If customer selected Gateway or doesn't have sufficient wallet balance
    if (preferredPayment === 'gateway' || walletBalance < newBooking.totalAmount) {
      setPendingBookingToDispatch(newBooking);
      setGatewayAmount(newBooking.totalAmount);
      setGatewayOrderTitle(newBooking.title);
      setGatewayOrderId(newBooking.id);
      setIsPaymentGatewayOpen(true);
    } else {
      const remaining = walletBalance - newBooking.totalAmount;
      setWalletBalance(remaining);
      if (authUser) {
        const updated = { ...authUser, walletBalance: remaining };
        setAuthUser(updated);
        AuthService.saveSession(updated);
      }
      const finalBooking: ActiveBooking = {
        ...newBooking,
        paymentMethod: `${config.appName.toUpperCase()} WALLET ESCROW`
      };
      setActiveBookings((prev) => [finalBooking, ...prev]);
      setTrackedBooking(finalBooking);
    }
  };

  const handlePaymentSuccess = (transaction: PaymentGatewayTransaction) => {
    if (pendingBookingToDispatch) {
      const finalBooking: ActiveBooking = {
        ...pendingBookingToDispatch,
        paymentTransaction: transaction,
        paymentMethod: transaction.method.toUpperCase()
      };
      setActiveBookings((prev) => [finalBooking, ...prev]);
      setTrackedBooking(finalBooking);
      setPendingBookingToDispatch(null);
    } else {
      // Top up wallet
      const newBal = walletBalance + transaction.amount;
      setWalletBalance(newBal);
      if (authUser) {
        const updated = { ...authUser, walletBalance: newBal };
        setAuthUser(updated);
        AuthService.saveSession(updated);
      }
    }
  };

  const handleTriggerTopUp = (amount: number = 500) => {
    setPendingBookingToDispatch(null);
    setGatewayAmount(amount);
    setGatewayOrderTitle(`Add Funds to ${config.appName} Wallet`);
    setGatewayOrderId(`TOPUP-${Date.now().toString().slice(-5)}`);
    setIsPaymentGatewayOpen(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    setActiveBookings((prev) => prev.filter((b) => b.id !== bookingId));
    if (trackedBooking?.id === bookingId) {
      setTrackedBooking(null);
    }
  };

  const handleCompleteBooking = (bookingId: string) => {
    setActiveBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'completed' } : b));
    if (trackedBooking?.id === bookingId) {
      setTrackedBooking(null);
    }
    alert(`Order ${bookingId} has been successfully completed and revenue logged!`);
  };

  const scrollToDownload = () => {
    const el = document.getElementById('download');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      
      {/* Client-Ready Multi-Role Switcher & White-Label Bar */}
      <div className="bg-[#12131b] border-b border-white/10 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-50">
        
        {/* Brand & City Marker */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">
            {config.appName} <span className="text-amber-400">Platform Suite</span>
          </span>
          <span className="text-white/20 hidden md:inline">|</span>
          <span className="text-neutral-400 hidden md:inline">
            Territory: <strong className="text-neutral-200">{config.city}</strong>
          </span>
          {authUser && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 hidden lg:inline">
              User: <strong className="text-white">{authUser.name}</strong> ({authUser.activeRole})
            </span>
          )}
        </div>

        {/* 4 Interactive Commercial Portals for Client Evaluation */}
        <div className="flex items-center gap-1 bg-black/70 p-1 rounded-xl border border-white/10 overflow-x-auto scrollbar-none max-w-full">
          <button
            onClick={() => {
              handleSwitchRole('customer');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentRole === 'customer'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1. Customer App</span>
          </button>

          <button
            onClick={() => {
              handleSwitchRole('partner');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentRole === 'driver'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>2. Task Partner / Pilot App</span>
          </button>

          <button
            onClick={() => setCurrentRole('merchant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentRole === 'merchant'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>3. Merchant Hub</span>
          </button>

          <button
            onClick={() => setCurrentRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentRole === 'admin'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Operations Admin</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Top Up Wallet via Gateway Button */}
          <button
            onClick={() => handleTriggerTopUp(500)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
            title="Open Payment Gateway to add funds"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gateway Checkout</span>
          </button>

          <button
            onClick={() => setIsClientPitchOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>White-Label / Buy Platform</span>
          </button>
        </div>

      </div>

      {/* PORTAL ROUTER: Renders whichever portal the client or user chooses */}
      {currentRole === 'admin' ? (
        /* Super Admin Operations Portal */
        <main className="flex-1 bg-[#090a0d]">
          <AdminConsole
            bookings={activeBookings}
            config={config}
            onUpdateConfig={setConfig}
            onCompleteBooking={handleCompleteBooking}
          />
        </main>
      ) : currentRole === 'driver' ? (
        /* Pilot / Driver Companion App */
        <main className="flex-1 bg-[#08080c] py-6 flex flex-col items-center justify-center">
          <div className="mb-3 text-center">
            <h2 className="font-display font-bold text-lg text-white">{config.appName} Task Partner Companion</h2>
            <p className="text-xs text-neutral-400">Test online dispatching, rider OTP check, turn-by-turn navigation & earnings</p>
          </div>
          <DriverPartnerApp
            activeBookings={activeBookings}
            config={config}
            onTripCompleted={handleCompleteBooking}
            onUpdateBooking={(updated) => {
              setActiveBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
              if (trackedBooking?.id === updated.id) setTrackedBooking(updated);
            }}
          />
        </main>
      ) : currentRole === 'merchant' ? (
        /* Restaurant & Merchant Kitchen Portal */
        <main className="flex-1 bg-[#090a0d]">
          <MerchantHub
            activeBookings={activeBookings}
            config={config}
          />
        </main>
      ) : (
        /* Customer Portal (Web + Mobile Simulator) */
        <div className="flex-1 flex flex-col">
          {/* Sub-bar for Customer View Mode */}
          <div className="bg-[#0e0f16] border-b border-white/5 px-4 py-1.5 flex items-center justify-between text-xs">
            <span className="text-neutral-400 text-[11px]">
              Customer App View Mode:
            </span>
            <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => {
                  setViewMode('dual');
                  setShowSimulator(true);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  viewMode === 'dual' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Columns className="w-3 h-3" />
                <span>Dual View (Exact Image Match)</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('web');
                  setShowSimulator(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  viewMode === 'web' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Web Portal</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('mobile');
                  setShowSimulator(true);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  viewMode === 'mobile' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Mobile Only</span>
              </button>
            </div>
          </div>

          {/* Main Navbar */}
          <Navbar
            appName={config.appName}
            user={authUser}
            onOpenBooking={() => handleOpenBooking('ride')}
            onToggleSimulator={() => setShowSimulator(!showSimulator)}
            showSimulator={showSimulator}
            onOpenClientSuite={() => setIsClientPitchOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onSwitchRole={handleSwitchRole}
            onOpenPaymentGateway={() => handleTriggerTopUp(500)}
          />

          {viewMode === 'mobile' ? (
            /* Standalone Phone Simulator View */
            <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#090a0d] to-[#040405]">
              <div className="mb-4 text-center">
                <h2 className="font-display font-bold text-lg text-white">Interactive {config.appName} Mobile App</h2>
                <p className="text-xs text-neutral-400">Click services, speak in AI voice assistant, test bookings, inspect invoices</p>
              </div>
              <MobileSimulator
                appName={config.appName}
                currencySymbol={config.currencySymbol}
                onOpenBooking={handleOpenBooking}
                activeBookings={activeBookings}
                walletBalance={walletBalance}
                onAddFunds={(amt) => handleTriggerTopUp(amt)}
                onViewInvoice={(b) => setInvoiceBooking(b)}
                onOpenAiAssistant={handleOpenAiAssistant}
                user={authUser}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
                onSwitchRole={handleSwitchRole}
                onOpenPaymentGateway={(amt) => handleTriggerTopUp(amt || 500)}
              />
            </main>
          ) : (
            /* Web Portal or Dual View */
            <main className="flex-1">
              {viewMode === 'dual' ? (
                /* Dual View: Desktop Landing Left + Mobile Simulator Right */
                <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 py-6">
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    {/* Left 8 Columns: Desktop Web Portal */}
                    <div className="xl:col-span-8 space-y-0 rounded-3xl overflow-hidden border border-white/10 bg-[#090a0d] shadow-2xl">
                      <Hero
                        appName={config.appName}
                        onOpenBooking={() => handleOpenBooking('ride')}
                        onScrollToDownload={scrollToDownload}
                        onOpenSimulator={() => setViewMode('mobile')}
                        onOpenAiAssistant={handleOpenAiAssistant}
                      />
                      
                      <ServiceCategories
                        onSelectService={handleOpenBooking}
                        selectedService={selectedService}
                      />

                      <EverythingGrid onSelectService={handleOpenBooking} />

                      <PartnersBanner />

                      <WhyChooseUs />
                    </div>

                    {/* Right 4 Columns: Sticky Phone Simulator matching reference */}
                    <div className="xl:col-span-4 sticky top-24 hidden xl:flex flex-col items-center">
                      <div className="w-full flex items-center justify-between px-2 mb-3 text-xs text-neutral-400">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-amber-400" />
                          Live Mobile App Simulator
                        </span>
                        <span className="text-[11px] text-amber-400/80 font-mono">Interactive</span>
                      </div>

                      <MobileSimulator
                        appName={config.appName}
                        currencySymbol={config.currencySymbol}
                        onOpenBooking={handleOpenBooking}
                        activeBookings={activeBookings}
                        walletBalance={walletBalance}
                        onAddFunds={(amt) => handleTriggerTopUp(amt)}
                        onViewInvoice={(b) => setInvoiceBooking(b)}
                        onOpenAiAssistant={handleOpenAiAssistant}
                        user={authUser}
                        onOpenAuth={() => setIsAuthModalOpen(true)}
                        onLogout={handleLogout}
                        onSwitchRole={handleSwitchRole}
                        onOpenPaymentGateway={(amt) => handleTriggerTopUp(amt || 500)}
                      />
                    </div>

                  </div>
                </div>
              ) : (
                /* Full Web Portal View */
                <div className="space-y-0">
                  <Hero
                    appName={config.appName}
                    onOpenBooking={() => handleOpenBooking('ride')}
                    onScrollToDownload={scrollToDownload}
                    onOpenSimulator={() => {
                      setViewMode('mobile');
                      setShowSimulator(true);
                    }}
                    onOpenAiAssistant={handleOpenAiAssistant}
                  />
                  
                  <ServiceCategories
                    onSelectService={handleOpenBooking}
                    selectedService={selectedService}
                  />

                  <EverythingGrid onSelectService={handleOpenBooking} />

                  <PartnersBanner />

                  <WhyChooseUs />
                </div>
              )}
            </main>
          )}

          {/* Footer */}
          <Footer onSelectService={handleOpenBooking} />
        </div>
      )}

      {/* Floating Active Trip Pill */}
      {activeBookings.length > 0 && !trackedBooking && currentRole === 'customer' && (
        <aside
          aria-label="Active service dispatch status"
          onClick={() => setTrackedBooking(activeBookings[0])}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#14151e]/95 border border-amber-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(250,204,21,0.25)] backdrop-blur-md cursor-pointer hover:scale-102 transition-transform"
        >
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span>{activeBookings[0].driverName}</span>
              <span className="text-amber-400">· {activeBookings[0].eta}m ETA</span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate max-w-[200px]">
              {activeBookings[0].title} (OTP: {activeBookings[0].otp})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTrackedBooking(activeBookings[0]);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-400 text-neutral-950 font-bold text-[11px] whitespace-nowrap"
            >
              Track
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInvoiceBooking(activeBookings[0]);
              }}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-[11px] font-semibold"
              title="View Invoice"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        config={config}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentGatewayOpen}
        onClose={() => setIsPaymentGatewayOpen(false)}
        amount={gatewayAmount}
        orderTitle={gatewayOrderTitle}
        orderId={gatewayOrderId}
        config={config}
        walletBalance={walletBalance}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Customer Booking Form Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setAiFallbackMessage(null);
        }}
        initialService={selectedService}
        onBookingConfirmed={handleBookingConfirmed}
        walletBalance={walletBalance}
        onOpenAiAssistant={handleOpenAiAssistant}
        appName={config.appName}
        currencySymbol={config.currencySymbol}
        config={config}
        fallbackMessage={aiFallbackMessage}
      />

      {/* AI Errand Assistant Modal */}
      <AiErrandAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        config={config}
        onErrandCreated={handleBookingConfirmed}
        walletBalance={walletBalance}
        onOpenManualForm={(message, initialCat) => {
          setIsAiAssistantOpen(false);
          setAiFallbackMessage(message);
          if (initialCat) setSelectedService(initialCat);
          setIsBookingOpen(true);
        }}
      />

      {/* Live Order Tracker Modal */}
      <ActiveOrderTracker
        booking={trackedBooking}
        onClose={() => setTrackedBooking(null)}
        onCancelBooking={handleCancelBooking}
        onAcceptCounteroffer={(bookingId, counterAmount) => {
          setActiveBookings(prev => prev.map(b => {
            if (b.id === bookingId) {
              return {
                ...b,
                totalAmount: counterAmount,
                negotiation: b.negotiation ? {
                  ...b.negotiation,
                  status: 'accepted',
                  isPriceLocked: true
                } : undefined,
                priceBreakdown: b.priceBreakdown ? {
                  ...b.priceBreakdown,
                  acceptedFinalPrice: counterAmount,
                  isPriceLocked: true
                } : undefined
              };
            }
            return b;
          }));
          if (trackedBooking?.id === bookingId) {
            setTrackedBooking(prev => prev ? {
              ...prev,
              totalAmount: counterAmount,
              negotiation: prev.negotiation ? {
                ...prev.negotiation,
                status: 'accepted',
                isPriceLocked: true
              } : undefined,
              priceBreakdown: prev.priceBreakdown ? {
                ...prev.priceBreakdown,
                acceptedFinalPrice: counterAmount,
                isPriceLocked: true
              } : undefined
            } : null);
          }
        }}
        onDeclineCounteroffer={(bookingId) => {
          setActiveBookings(prev => prev.map(b => {
            if (b.id === bookingId && b.negotiation) {
              return {
                ...b,
                negotiation: {
                  ...b.negotiation,
                  status: 'declined'
                }
              };
            }
            return b;
          }));
          if (trackedBooking?.id === bookingId && trackedBooking.negotiation) {
            setTrackedBooking(prev => prev ? {
              ...prev,
              negotiation: {
                ...prev.negotiation!,
                status: 'declined'
              }
            } : null);
          }
        }}
      />

      {/* Commercial License & White-Label Modal */}
      <ClientPitchModal
        isOpen={isClientPitchOpen}
        onClose={() => setIsClientPitchOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
      />

      {/* Tax Invoice Modal */}
      <InvoiceModal
        booking={invoiceBooking}
        config={config}
        onClose={() => setInvoiceBooking(null)}
      />

    </div>
  );
}
