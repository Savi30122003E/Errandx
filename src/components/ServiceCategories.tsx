import React from 'react';
import { 
  ShoppingCart, 
  Pill, 
  Package, 
  Sparkles, 
  Store, 
  FileText,
  Wheat
} from 'lucide-react';
import { ServiceType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ServiceCategoriesProps {
  onSelectService: (service: ServiceType) => void;
  selectedService?: ServiceType;
}

export const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  onSelectService,
  selectedService
}) => {
  const { t } = useLanguage();

  const CATEGORIES: { id: ServiceType; label: string; icon: React.ElementType }[] = [
    { id: 'groceries', label: t.services.groceries.title, icon: ShoppingCart },
    { id: 'medicine', label: t.services.medicine.title, icon: Pill },
    { id: 'parcel', label: t.services.parcel.title, icon: Package },
    { id: 'pooja', label: t.services.pooja.title, icon: Sparkles },
    { id: 'farm_produce', label: t.services.farm_produce.title, icon: Wheat },
    { id: 'local_shops', label: t.services.local_shops.title, icon: Store },
    { id: 'custom_errands', label: t.services.custom_errands.title, icon: FileText },
  ];

  return (
    <section className="py-6 border-b border-white/5 bg-[#0b0c10]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start lg:justify-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedService === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectService(cat.id)}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-200 min-w-[125px] sm:min-w-[150px] max-w-[180px] group border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(250,204,21,0.2)]'
                    : 'bg-[#14151b] border-white/5 text-neutral-300 hover:border-amber-400/40 hover:bg-[#1a1c24]'
                }`}
              >
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-110 ${
                  isSelected 
                    ? 'bg-amber-400 text-neutral-950' 
                    : 'bg-white/5 text-amber-400 group-hover:bg-amber-400 group-hover:text-neutral-950'
                }`}>
                  <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-center leading-tight line-clamp-2">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
