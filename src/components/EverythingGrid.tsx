import React from 'react';
import { 
  ShoppingCart, 
  Pill, 
  Package, 
  Sparkles, 
  Wheat,
  Store, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { ServiceType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface EverythingGridProps {
  onSelectService: (service: ServiceType) => void;
  townName?: string;
}

export const EverythingGrid: React.FC<EverythingGridProps> = ({ 
  onSelectService,
  townName = 'Your Town'
}) => {
  const { t, formatTown } = useLanguage();

  const SERVICES = [
    {
      id: 'groceries' as ServiceType,
      title: t.services.groceries.title,
      desc: formatTown(t.services.groceries.desc, townName),
      startingPrice: t.services.groceries.startingPrice,
      icon: ShoppingCart,
      badge: 'Local Stores'
    },
    {
      id: 'medicine' as ServiceType,
      title: t.services.medicine.title,
      desc: formatTown(t.services.medicine.desc, townName),
      startingPrice: t.services.medicine.startingPrice,
      icon: Pill,
      badge: 'Verified Pharmacies'
    },
    {
      id: 'parcel' as ServiceType,
      title: t.services.parcel.title,
      desc: formatTown(t.services.parcel.desc, townName),
      startingPrice: t.services.parcel.startingPrice,
      icon: Package,
      badge: 'Point-to-Point'
    },
    {
      id: 'pooja' as ServiceType,
      title: t.services.pooja.title,
      desc: formatTown(t.services.pooja.desc, townName),
      startingPrice: t.services.pooja.startingPrice,
      icon: Sparkles,
      badge: 'Temple Runs'
    },
    {
      id: 'farm_produce' as ServiceType,
      title: t.services.farm_produce.title,
      desc: formatTown(t.services.farm_produce.desc, townName),
      startingPrice: t.services.farm_produce.startingPrice,
      icon: Wheat,
      badge: 'Village Fresh'
    },
    {
      id: 'local_shops' as ServiceType,
      title: t.services.local_shops.title,
      desc: formatTown(t.services.local_shops.desc, townName),
      startingPrice: t.services.local_shops.startingPrice,
      icon: Store,
      badge: 'Town Merchants'
    },
    {
      id: 'custom_errands' as ServiceType,
      title: t.services.custom_errands.title,
      desc: formatTown(t.services.custom_errands.desc, townName),
      startingPrice: t.services.custom_errands.startingPrice,
      icon: FileText,
      badge: 'Bank & EB Paperwork'
    }
  ];

  return (
    <section id="services" className="py-20 bg-[#090a0d] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            {t.services.heading}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-normal">
            {formatTown(t.services.subheading, townName)}
          </p>
        </div>

        {/* 7-Card Town Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {SERVICES.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.id}
                onClick={() => onSelectService(card.id)}
                className="group text-left p-5 rounded-2xl bg-[#121319] hover:bg-[#181a23] border border-white/5 hover:border-amber-400/40 transition-all duration-200 flex flex-col justify-between min-h-[200px] relative overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] cursor-pointer"
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-bl-full group-hover:bg-amber-400/10 transition-colors pointer-events-none" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-amber-400/90 border border-white/5 font-semibold">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-3 mt-1.5 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4 text-xs">
                  <span className="text-neutral-400">
                    Starts at <strong className="text-amber-400 font-bold">{card.startingPrice}</strong>
                  </span>
                  <div className="flex items-center gap-1 text-neutral-400 group-hover:text-amber-400 font-semibold transition-colors">
                    <span>{t.actions.bookNow}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
