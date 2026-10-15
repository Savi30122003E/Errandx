import React, { useState } from 'react';
import { 
  Smartphone, 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  User, 
  LogOut, 
  CreditCard, 
  Repeat, 
  ShieldCheck,
  ChevronDown,
  KeyRound,
  Globe
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  appName: string;
  user: UserProfile | null;
  onOpenBooking: () => void;
  onToggleSimulator: () => void;
  showSimulator: boolean;
  onOpenClientSuite: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchRole: (role: 'customer' | 'partner') => void;
  onOpenPaymentGateway: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  appName,
  user,
  onOpenBooking,
  onToggleSimulator,
  showSimulator,
  onOpenClientSuite,
  onOpenAuth,
  onLogout,
  onSwitchRole,
  onOpenPaymentGateway
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Split name for accent display if ends with X or custom
  const mainName = appName.length > 1 ? appName.slice(0, -1) : appName;
  const lastChar = appName.length > 1 ? appName.slice(-1) : '';

  return (
    <header className="sticky top-0 z-40 bg-[#090a0d]/95 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Zone 1: Wordmark & Demo Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-1 group whitespace-nowrap">
            <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
              {mainName}<span className="text-amber-400">{lastChar}</span>
            </span>
          </a>

          {/* Demo mode badge as requested */}
          <span className="text-[10px] text-amber-400/90 font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 hidden sm:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Demo mode</span>
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-300">
          <a href="#home" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            {t.nav.home}
          </a>
          <a href="#services" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            {t.nav.services}
          </a>
          <a href="#why-us" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            {t.nav.howItWorks}
          </a>
          <a href="#partners" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            {t.nav.localShops}
          </a>
          <a href="#contact" className="hover:text-amber-400 transition-colors whitespace-nowrap">
            {t.nav.contact}
          </a>
        </nav>

        {/* Zone 3: Language Toggle, User Auth & CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* English / தமிழ் Language Toggle */}
          <div className="flex items-center bg-[#14151f] rounded-xl p-1 border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === 'ta'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="தமிழ்"
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* User Profile / Auth State Button */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-[#151620] hover:bg-[#1d1f2d] border border-white/10 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-amber-400 text-neutral-950 font-display font-black text-xs flex items-center justify-center shadow-md">
                  {user.avatar || 'TX'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-white block leading-tight">{user.name}</span>
                  <span className="text-[10px] text-amber-400 capitalize font-medium">
                    {user.activeRole === 'partner' ? '⚡ Partner' : '🛍️ Customer'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#12131b] border border-white/10 shadow-2xl p-3 space-y-2 z-50 text-left animate-in slide-in-from-top-2 duration-150">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-xs font-bold text-white block">{user.name}</span>
                    <span className="text-[11px] text-neutral-400 block font-mono">{user.phone}</span>
                    <span className="text-[10px] text-neutral-500 block truncate">{user.email}</span>
                  </div>

                  {/* Wallet & Gateway Button */}
                  <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-300 block">{t.nav.wallet}</span>
                      <span className="font-display font-black text-sm text-white">₹{user.walletBalance}.00</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenPaymentGateway();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 text-neutral-950 font-bold text-[11px] hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      {t.nav.topUp}
                    </button>
                  </div>

                  {/* Role Switcher */}
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSwitchRole(user.activeRole === 'customer' ? 'partner' : 'customer');
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Repeat className="w-4 h-4 text-amber-400" />
                    <span>
                      {user.activeRole === 'customer' ? t.nav.partnerMode : t.nav.customerMode}
                    </span>
                  </button>

                  {/* Sign Out */}
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer border-t border-white/5 pt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.nav.signOut}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t.nav.signIn}</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

          {/* Book Now Primary CTA */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-[0_2px_12px_rgba(250,204,21,0.3)] transition-all transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{t.nav.postErrand}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1017] border-b border-white/10 px-6 py-5 space-y-4 animate-in slide-in-from-top-4 duration-200 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-mono text-amber-400">{t.demoBadge}</span>
            <div className="flex items-center bg-black/60 rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  language === 'ta' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400'
                }`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  language === 'en' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <nav className="flex flex-col space-y-3 text-sm font-medium text-neutral-200">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-400 py-1">{t.nav.home}</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-400 py-1">{t.nav.services}</a>
            <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-400 py-1">{t.nav.howItWorks}</a>
            <a href="#partners" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-400 py-1">{t.nav.localShops}</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-400 py-1">{t.nav.contact}</a>
          </nav>
          
          <div className="pt-2 flex flex-col gap-2">
            {!user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 text-white font-bold text-xs"
              >
                {t.nav.signIn}
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPaymentGateway();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>{t.nav.wallet}: ₹{user.walletBalance} ({t.nav.topUp})</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenClientSuite();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-400/10 text-amber-300 font-semibold text-xs border border-amber-400/30"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Town White-Label & Commercial Console</span>
            </button>
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 text-neutral-950 font-bold text-sm shadow-md"
            >
              {t.nav.postErrand}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
