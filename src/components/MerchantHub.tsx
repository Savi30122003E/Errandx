import React, { useState } from 'react';
import { 
  Store, 
  UtensilsCrossed, 
  Check, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Power,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ActiveBooking, WhiteLabelConfig } from '../types';
import { FOOD_ITEMS } from '../data/mockData';

interface MerchantHubProps {
  activeBookings: ActiveBooking[];
  config: WhiteLabelConfig;
}

export const MerchantHub: React.FC<MerchantHubProps> = ({
  activeBookings,
  config
}) => {
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [kitchenOrders, setKitchenOrders] = useState([
    {
      id: 'K-4921',
      customer: 'Alex V.',
      items: 'Special Chicken Dum Biryani x 1, Ghee Podi Idli x 1',
      total: 420,
      status: 'preparing' as 'new' | 'preparing' | 'ready',
      time: '5 mins ago',
      assignedDriver: 'Rajesh Kumar (Pilot)'
    },
    {
      id: 'K-4922',
      customer: 'Meera R.',
      items: 'Paneer Makhani Handcrafted Thin Pizza x 1',
      total: 360,
      status: 'new' as 'new' | 'preparing' | 'ready',
      time: '1 min ago',
      assignedDriver: 'Finding nearby pilot...'
    }
  ]);

  const [menuStock, setMenuStock] = useState<Record<string, boolean>>({
    f1: true,
    f2: true,
    f3: true,
    f4: true,
    f5: false // Quinoa bowl 86 out of stock
  });

  const handleUpdateStatus = (id: string, newStatus: 'new' | 'preparing' | 'ready') => {
    setKitchenOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleToggleStock = (id: string) => {
    setMenuStock(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#14151e] border border-amber-400/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-2xl text-white">Aasife Biriyani House & Kitchens</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Verified {config.appName} Partner
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">Outlet #104 · Anna Nagar West, {config.city}</p>
          </div>
        </div>

        <button
          onClick={() => setIsStoreOpen(!isStoreOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isStoreOpen
              ? 'bg-emerald-500 text-neutral-950'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isStoreOpen ? 'STORE ONLINE (ACCEPTING ORDERS)' : 'STORE CLOSED'}</span>
        </button>
      </div>

      {/* Merchant Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111218] border border-white/5 space-y-1">
          <span className="text-xs text-neutral-400 font-semibold">Today's Restaurant Sales</span>
          <div className="font-display font-black text-2xl text-amber-400">
            {config.currencySymbol}9,450
          </div>
          <span className="text-[11px] text-neutral-400">24 orders processed</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111218] border border-white/5 space-y-1">
          <span className="text-xs text-neutral-400 font-semibold">Avg Kitchen Preparation Time</span>
          <div className="font-display font-black text-2xl text-white">14.2 Mins</div>
          <span className="text-[11px] text-emerald-400">Target &lt;16m met</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111218] border border-white/5 space-y-1">
          <span className="text-xs text-neutral-400 font-semibold">Merchant Payout Status</span>
          <div className="font-display font-black text-2xl text-emerald-400">Automated T+1</div>
          <span className="text-[11px] text-neutral-400">Direct settlement to HDFC Bank</span>
        </div>
      </div>

      {/* Main Grid: Kitchen Orders Queue + Live 86 Inventory Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Cols: Kitchen Orders */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-neutral-300 uppercase tracking-wider">
              Live Kitchen Orders ({kitchenOrders.length})
            </span>
            <span className="text-amber-400">Auto-printed to KOT terminal</span>
          </div>

          <div className="space-y-3">
            {kitchenOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-[#12131b] border border-white/10 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-amber-400/10 text-amber-400">
                      {order.id}
                    </span>
                    <h4 className="font-bold text-sm text-white">{order.customer}</h4>
                    <span className="text-xs text-neutral-400">· {order.time}</span>
                  </div>

                  <span className="font-display font-bold text-base text-amber-400">
                    {config.currencySymbol}{order.total}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-200 font-mono">
                  {order.items}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-neutral-400">
                    Pilot assigned: <strong className="text-white">{order.assignedDriver}</strong>
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {order.status === 'new' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                        className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs"
                      >
                        Accept & Start Cooking
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ready')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs"
                      >
                        Food Ready for Driver Handover
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Handed to Driver
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Live Stock / Menu Toggle */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#12131b] border border-white/10 space-y-4">
          <div>
            <h4 className="font-display font-bold text-sm text-white">Live Menu Stock (Instant 86)</h4>
            <p className="text-[11px] text-neutral-400">Toggle off items that run out of stock during service</p>
          </div>

          <div className="space-y-2.5">
            {FOOD_ITEMS.map((item) => {
              const inStock = menuStock[item.id] !== false;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="text-white font-medium block truncate">{item.name}</span>
                    <span className="text-amber-400 font-mono">{config.currencySymbol}{item.price}</span>
                  </div>

                  <button
                    onClick={() => handleToggleStock(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer shrink-0 ${
                      inStock
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
