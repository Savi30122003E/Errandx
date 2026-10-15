import React from 'react';
import { MapPin, Users, Tag, FileText, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WhyChooseUs: React.FC<{ townName?: string }> = ({ townName = 'Your Town' }) => {
  const { t, formatTown } = useLanguage();

  const features = [
    {
      icon: MapPin,
      title: t.whyUs.pillar1Title,
      description: formatTown(t.whyUs.pillar1Desc, townName)
    },
    {
      icon: Users,
      title: t.whyUs.pillar2Title,
      description: formatTown(t.whyUs.pillar2Desc, townName)
    },
    {
      icon: Tag,
      title: t.whyUs.pillar3Title,
      description: formatTown(t.whyUs.pillar3Desc, townName)
    },
    {
      icon: FileText,
      title: t.whyUs.pillar4Title,
      description: formatTown(t.whyUs.pillar4Desc, townName)
    },
    {
      icon: Globe,
      title: t.whyUs.pillar5Title,
      description: formatTown(t.whyUs.pillar5Desc, townName)
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-[#090a0d] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            {formatTown(t.whyUs.title, townName)}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {t.whyUs.subtitle}
          </p>
        </div>

        {/* 5 items in clean row / grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#121319]/60 border border-white/5 hover:border-amber-400/30 transition-colors group"
              >
                {/* Yellow outline polygon/circle */}
                <div className="w-13 h-13 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-all duration-200">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-sm text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
