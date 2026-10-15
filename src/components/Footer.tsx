import React from 'react';
import { Mail, Phone, MapPin, Twitter, Instagram, Linkedin, Facebook, ShieldCheck } from 'lucide-react';
import { ServiceType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onSelectService: (service: ServiceType) => void;
  appName?: string;
  townName?: string;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectService,
  appName = 'ErrandX',
  townName = 'Your Town'
}) => {
  const { t, formatTown } = useLanguage();

  return (
    <footer id="contact" className="bg-[#07080a] text-neutral-400 pt-16 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <a href="#" className="inline-flex items-center gap-1 group">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {appName.slice(0, -1)}<span className="text-amber-400">{appName.slice(-1) || 'X'}</span>
              </span>
            </a>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
              {formatTown(t.subTagline, townName)}
            </p>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-amber-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.demoBadge}</span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400 text-neutral-400 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400 text-neutral-400 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400 text-neutral-400 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400 text-neutral-400 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Errand Categories */}
          <div className="space-y-4 text-left">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              {t.footer.servicesTitle}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><button onClick={() => onSelectService('groceries')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">{t.services.groceries.title}</button></li>
              <li><button onClick={() => onSelectService('medicine')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">{t.services.medicine.title}</button></li>
              <li><button onClick={() => onSelectService('parcel')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">{t.services.parcel.title}</button></li>
              <li><button onClick={() => onSelectService('pooja')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">{t.services.pooja.title}</button></li>
              <li><button onClick={() => onSelectService('farm_produce')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">{t.services.farm_produce.title}</button></li>
              <li><button onClick={() => onSelectService('local_shops')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">{t.services.local_shops.title}</button></li>
              <li><button onClick={() => onSelectService('custom_errands')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">{t.services.custom_errands.title}</button></li>
            </ul>
          </div>

          {/* Column 3: Town Geography */}
          <div className="space-y-4 text-left">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              {formatTown(t.footer.location, townName)}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>Main Bus Stand</li>
              <li>Market Street Bazaar</li>
              <li>Town Railway Station</li>
              <li>Town Temple & Sannathi St</li>
              <li>Government Hospital</li>
              <li>Taluk & Revenue Office</li>
              <li>College Road Junction</li>
              <li>River Bridge Causeway</li>
            </ul>
          </div>

          {/* Column 4: Contact & Administration */}
          <div className="space-y-4 text-left">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              {t.footer.contactTitle}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">{t.footer.nameLabel}</span>
                <span className="text-neutral-300 font-medium">[YOUR NAME]</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-neutral-300 font-mono">[PHONE]</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-neutral-300">[EMAIL]</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-neutral-300">{formatTown('{townName}, Tamil Nadu', townName)}</span>
              </li>
            </ul>

            <div className="pt-2 text-xs">
              <span className="text-[10px] text-neutral-500 block leading-normal">
                {t.footer.disclaimer}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 {appName}. {t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <a href="#terms" className="hover:text-neutral-400 transition-colors">Terms & Conditions</a>
            <a href="#privacy" className="hover:text-neutral-400 transition-colors">Privacy Policy</a>
            <span className="text-amber-400 font-mono text-[10px]">{t.demoData}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
