import React from 'react';
import { X, Printer, ShieldCheck, Download, Check } from 'lucide-react';
import { ActiveBooking, WhiteLabelConfig } from '../types';

interface InvoiceModalProps {
  booking: ActiveBooking | null;
  config: WhiteLabelConfig;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  booking,
  config,
  onClose
}) => {
  if (!booking) return null;

  const baseFare = Math.round(booking.totalAmount * 0.4);
  const distanceFare = Math.round(booking.totalAmount * 0.45);
  const gstTax = Math.round(booking.totalAmount * (config.taxGstPercent / 100));
  const platformFee = Math.round(booking.totalAmount * 0.05);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e0f15] border border-amber-400/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(250,204,21,0.2)] overflow-hidden text-left my-auto p-6 sm:p-8 space-y-6">
        
        {/* Invoice Top Actions */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-2xl text-white">
              {config.appName}
            </span>
            <span className="text-amber-400 font-display font-black text-2xl">X</span>
            <span className="text-[10px] text-neutral-400 ml-2 uppercase font-mono tracking-widest">
              Tax Invoice
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-2 gap-4 text-xs text-neutral-400">
          <div>
            <span className="block text-[10px] uppercase font-bold text-neutral-500">Invoice Number</span>
            <span className="font-mono text-white font-bold">INV-{booking.id}-2026</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold text-neutral-500">Date & Time</span>
            <span className="text-white font-medium">{booking.timestamp || 'Today, 20:45'}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-neutral-500">Billed To</span>
            <span className="text-white font-medium">{booking.customerName || 'Customer'}</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold text-neutral-500">Service Assigned</span>
            <span className="text-amber-400 font-semibold">{booking.serviceName} ({booking.driverName})</span>
          </div>
        </div>

        {/* Route Details */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold shrink-0">From:</span>
            <span className="text-neutral-300">{booking.pickupLocation}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-bold shrink-0">To:</span>
            <span className="text-neutral-300">{booking.dropLocation}</span>
          </div>
        </div>

        {/* Itemized Fare Table */}
        <div className="space-y-2 text-xs border-t border-b border-white/10 py-3">
          <div className="flex justify-between text-neutral-300">
            <span>Base Fare & Booking Charge</span>
            <span className="font-mono font-medium">{config.currencySymbol}{baseFare}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Distance & Travel Time Rate</span>
            <span className="font-mono font-medium">{config.currencySymbol}{distanceFare}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Applicable GST / Tax ({config.taxGstPercent}%)</span>
            <span className="font-mono font-medium">{config.currencySymbol}{gstTax}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Platform Tech Convenience Fee</span>
            <span className="font-mono font-medium">{config.currencySymbol}{platformFee}</span>
          </div>
          
          <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
            <span>Total Paid ({config.appName} Wallet / Cash / UPI)</span>
            <span className="font-display text-amber-400 text-lg">
              {config.currencySymbol}{booking.totalAmount}
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Digital GST Tax Receipt</span>
          </div>
          <span>{config.appName} Technologies Inc.</span>
        </div>

        <button
          onClick={handlePrint}
          className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Tax Receipt</span>
        </button>

      </div>
    </div>
  );
};
