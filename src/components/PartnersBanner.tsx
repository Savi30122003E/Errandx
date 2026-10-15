import React from 'react';
import { Store, Clock, Star, MapPin, Phone } from 'lucide-react';
import { PLACEHOLDER_SHOPS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const PartnersBanner: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="partners" className="bg-[#0c0d12] py-16 text-white border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-400">
              <Store className="w-3.5 h-3.5" />
              <span>{t.shopsBanner.badge}</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {t.shopsBanner.title}
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm">
              {t.shopsBanner.subtitle}
            </p>
          </div>
          
          <div className="text-xs text-neutral-400">
            <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/10 font-mono text-[11px] text-amber-300">
              {t.demoBadge}
            </span>
          </div>
        </div>

        {/* Shop Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PLACEHOLDER_SHOPS.map((shop) => {
            const name = language === 'ta' ? shop.nameTa : shop.nameEn;
            const category = language === 'ta' ? shop.categoryTa : shop.categoryEn;
            const location = language === 'ta' ? shop.locationTa : shop.locationEn;

            return (
              <div 
                key={shop.id}
                className="p-4 rounded-2xl bg-[#14151e] border border-white/5 hover:border-amber-400/40 transition-colors text-left flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-amber-400/90 border border-white/5">
                      {t.demoData}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{shop.rating}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      {name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                      {category}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-1.5 text-[11px] text-neutral-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span>{shop.timing}</span>
                  </div>
                  {shop.phone && (
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Phone className="w-3 h-3 shrink-0" />
                      <span className="font-mono text-[10px]">{shop.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
