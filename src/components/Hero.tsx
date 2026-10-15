import React from 'react';
import { ArrowRight, Download, ShieldCheck, MapPin, Zap, Star, Sparkles } from 'lucide-react';

interface HeroProps {
  appName?: string;
  onOpenBooking: () => void;
  onScrollToDownload: () => void;
  onOpenSimulator: () => void;
  onOpenAiAssistant?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  appName = 'ErrandX',
  onOpenBooking,
  onScrollToDownload,
  onOpenSimulator,
  onOpenAiAssistant
}) => {
  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-16 lg:py-24 border-b border-white/5">
      {/* Background ambient gold glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-yellow-400/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Value proposition pill/editorial tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Hyperlocal Services Across Your City</span>
              <span className="text-white/40">·</span>
              <span className="text-neutral-300">Average ETA: 4.8 Mins</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1] text-balance">
                One App. <br />
                Every <span className="text-amber-400 underline decoration-amber-400/40 decoration-4 underline-offset-8">Local Service.</span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-300 max-w-xl font-normal leading-relaxed text-balance">
                {appName} is your all-in-one local errand and services marketplace. Post any task, describe in voice, negotiate fair prices, and track trusted Task Partners.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm sm:text-base shadow-[0_4px_24px_rgba(250,204,21,0.35)] hover:shadow-[0_6px_30px_rgba(250,204,21,0.5)] transition-all transform active:scale-98 cursor-pointer"
              >
                <span>Book Task Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {onOpenAiAssistant && (
                <button
                  onClick={onOpenAiAssistant}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 font-bold text-sm sm:text-base transition-all shadow-[0_0_20px_rgba(250,204,21,0.15)] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Errand Assistant</span>
                </button>
              )}

              <button
                onClick={onScrollToDownload}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-white/15 font-semibold text-sm sm:text-base transition-colors hover:border-amber-400/50 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download App</span>
              </button>
            </div>

            {/* Micro-proof indicators */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <p className="font-display font-bold text-2xl text-white">100%</p>
                <p className="text-xs text-neutral-400">Town Errands</p>
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-amber-400">Local</p>
                <p className="text-xs text-neutral-400">Task Partners</p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-display font-bold text-2xl text-white">4.9</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-xs text-neutral-400">Neighborhood Rating</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Mockup */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Visual Phone Presentation */}
            <div className="relative w-full max-w-[420px] mx-auto group">
              {/* Golden polygon glow and geometric corner accents */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-yellow-400/15 rounded-full blur-2xl" />

              {/* Decorative Map Markers */}
              <div className="absolute -top-3 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-amber-400/30 text-[11px] font-medium text-amber-300 shadow-xl backdrop-blur-md animate-bounce duration-1000">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Town Centre · 2m away</span>
              </div>

              <div className="absolute top-1/2 -right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 text-[11px] font-medium text-white shadow-xl backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Verified Partners</span>
              </div>

              {/* Device frame card */}
              <div className="relative rounded-3xl overflow-hidden border border-amber-400/30 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-2.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(250,204,21,0.15)]">
                
                {/* Phone screen container */}
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-[560px] w-full flex flex-col justify-between">
                  {/* Generated Phone Mockup Image */}
                  <img
                    src="/src/assets/images/errandx_hero_showcase_1791950270951.jpg"
                    alt="ErrandX Local Errand App interface on smartphone"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter brightness-105"
                  />

                  {/* Overlay brand banner */}
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/85 to-transparent text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-extrabold text-xl text-white">
                        Errand<span className="text-amber-400">X</span>
                      </span>
                      <span className="text-xs font-medium text-amber-400">One app. Every local errand in your town.</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-tight">
                      Local errands, pharmacy runs, parcels, pooja items & trusted neighborhood task partners.
                    </p>
                    <button
                      onClick={onOpenSimulator}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-400/90 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Try Interactive Simulator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
