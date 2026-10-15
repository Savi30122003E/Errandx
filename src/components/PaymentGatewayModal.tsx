import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Banknote, 
  ShieldCheck, 
  Lock, 
  Check, 
  ArrowRight,
  AlertCircle,
  Sparkles,
  QrCode
} from 'lucide-react';
import { PaymentGatewayMethod, PaymentGatewayTransaction, WhiteLabelConfig } from '../types';
import { PaymentService } from '../services/paymentService';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderTitle: string;
  orderId: string;
  config: WhiteLabelConfig;
  walletBalance: number;
  onPaymentSuccess: (transaction: PaymentGatewayTransaction) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  amount,
  orderTitle,
  orderId,
  config,
  walletBalance,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentGatewayMethod>('upi');
  
  // UPI State
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'vpa'>('gpay');
  const [vpaId, setVpaId] = useState('alex@okhdfcbank');

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8824');
  const [cardName, setCardName] = useState('Alex Vance');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('382');
  const [show3dSecureOtp, setShow3dSecureOtp] = useState(false);
  const [bank3dsOtp, setBank3dsOtp] = useState('918234');

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing & State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [completedTxn, setCompletedTxn] = useState<PaymentGatewayTransaction | null>(null);

  if (!isOpen) return null;

  const handleInitiatePayment = async () => {
    // If card payment, simulate 3D Secure OTP verification first
    if (selectedMethod === 'card' && !show3dSecureOtp) {
      setShow3dSecureOtp(true);
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Connecting to Banking Gateway (AES-256)...');

    setTimeout(async () => {
      setProcessingStep('Authorizing payment with issuer bank...');
      
      const txn = await PaymentService.processPayment(amount, selectedMethod, orderId, {
        upiVpa: selectedMethod === 'upi' ? vpaId : undefined,
        cardLast4: selectedMethod === 'card' ? '8824' : undefined,
        cardBrand: selectedMethod === 'card' ? 'Visa Platinum' : undefined,
        bankName: selectedMethod === 'netbanking' ? selectedBank : undefined
      });

      setIsProcessing(false);
      setCompletedTxn(txn);

      setTimeout(() => {
        onPaymentSuccess(txn);
        onClose();
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f1016] border border-amber-400/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(250,204,21,0.2)] overflow-hidden my-auto flex flex-col text-left">
        
        {/* Gateway Top Bar */}
        <div className="p-5 border-b border-white/10 bg-[#141520] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-md">
              <Lock className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base text-white">
                  {config.appName} Secure Payment Gateway
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  PCI-DSS Level 1
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Order Ref: <span className="text-white font-mono">{orderId}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Total Amount</span>
              <span className="font-display font-black text-xl text-amber-400">
                {config.currencySymbol}{amount}
              </span>
            </div>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {completedTxn ? (
          /* Payment Success State */
          <div className="p-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xl text-white">Payment Authorized Successfully!</h4>
              <p className="text-xs text-neutral-400 mt-1">Transaction ID: <span className="font-mono text-amber-400 font-bold">{completedTxn.id}</span></p>
              <p className="text-xs text-emerald-400 font-medium mt-1">
                Receipt #{completedTxn.receiptNumber} generated. Task Partner dispatched!
              </p>
            </div>
          </div>
        ) : isProcessing ? (
          /* Processing State */
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto" />
            <div>
              <h4 className="font-display font-bold text-base text-white">Processing Transaction</h4>
              <p className="text-xs text-neutral-400 mt-1 font-mono">{processingStep}</p>
              <p className="text-[11px] text-neutral-500 mt-2">Please do not refresh or close this window.</p>
            </div>
          </div>
        ) : show3dSecureOtp ? (
          /* 3D Secure Bank OTP Simulation */
          <div className="p-6 sm:p-8 space-y-5 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h5 className="font-bold text-xs text-white">Visa Secure 3D Authentication</h5>
                <p className="text-[11px] text-neutral-400">Verifying card ending in 8824 with Issuer Bank (HDFC Bank)</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300 font-semibold">Enter One-Time Bank Password</span>
                <span className="text-amber-400 font-mono text-[11px]">Test Code: 918234</span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={bank3dsOtp}
                onChange={(e) => setBank3dsOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black border border-amber-400/50 text-center font-mono font-bold text-xl text-amber-400 tracking-widest focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShow3dSecureOtp(false)}
                className="w-1/2 py-2.5 rounded-xl bg-white/5 text-neutral-300 font-bold text-xs"
              >
                Back to Methods
              </button>
              <button
                type="button"
                onClick={handleInitiatePayment}
                className="w-1/2 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Verify & Pay {config.currencySymbol}{amount}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Method Selector */
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
            
            {/* Left Method List */}
            <div className="md:col-span-5 p-4 border-r border-white/10 bg-[#0d0e14] space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-2 mb-2">
                Payment Options
              </span>

              {/* UPI */}
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'upi'
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <div className="text-left">
                  <span>UPI Express</span>
                  <span className="block text-[10px] opacity-75 font-normal">GPay, PhonePe, Paytm</span>
                </div>
              </button>

              {/* Cards */}
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'card'
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <div className="text-left">
                  <span>Cards (Debit / Credit)</span>
                  <span className="block text-[10px] opacity-75 font-normal">Visa, Mastercard, RuPay</span>
                </div>
              </button>

              {/* ErrandX Wallet */}
              <button
                type="button"
                onClick={() => setSelectedMethod('wallet')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'wallet'
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <div className="text-left">
                  <span>{config.appName} Wallet</span>
                  <span className="block text-[10px] opacity-75 font-normal">Balance: {config.currencySymbol}{walletBalance}</span>
                </div>
              </button>

              {/* Net Banking */}
              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'netbanking'
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <div className="text-left">
                  <span>Net Banking</span>
                  <span className="block text-[10px] opacity-75 font-normal">All Major Indian Banks</span>
                </div>
              </button>

              {/* Cash on Task Delivery */}
              <button
                type="button"
                onClick={() => setSelectedMethod('cash')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedMethod === 'cash'
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <div className="text-left">
                  <span>Pay on Delivery (COD)</span>
                  <span className="block text-[10px] opacity-75 font-normal">Cash to Task Partner</span>
                </div>
              </button>
            </div>

            {/* Right Method Configuration Panel */}
            <div className="md:col-span-7 p-6 space-y-5">
              
              {/* METHOD: UPI */}
              {selectedMethod === 'upi' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Choose UPI App
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'gpay', name: 'Google Pay' },
                      { id: 'phonepe', name: 'PhonePe' },
                      { id: 'paytm', name: 'Paytm UPI' }
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiApp(app.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          upiApp === app.id
                            ? 'bg-amber-400/15 border-amber-400 text-amber-300 font-bold shadow-sm'
                            : 'bg-black/40 border-white/10 text-neutral-300'
                        }`}
                      >
                        <span className="text-xs block font-bold">{app.name}</span>
                        <span className="text-[10px] text-neutral-400">Instant Pay</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-neutral-300">Or enter UPI ID / VPA</label>
                    <input
                      type="text"
                      value={vpaId}
                      onChange={(e) => setVpaId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <span className="text-[10px] text-neutral-400 block">A collect request will be sent to your UPI app</span>
                  </div>
                </div>
              )}

              {/* METHOD: CARDS */}
              {selectedMethod === 'card' && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Debit / Credit Card Details
                  </span>

                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-neutral-400">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-mono text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-neutral-400">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD: WALLET */}
              {selectedMethod === 'wallet' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-300">Available Wallet Balance</span>
                    <div className="font-display font-black text-2xl text-white">
                      {config.currencySymbol}{walletBalance}.00
                    </div>
                    {walletBalance >= amount ? (
                      <span className="text-xs text-emerald-400 font-semibold block pt-1">
                        ✓ Sufficient balance for 1-tap checkout
                      </span>
                    ) : (
                      <span className="text-xs text-red-400 font-semibold block pt-1">
                        ⚠️ Low balance. Add {config.currencySymbol}{amount - walletBalance} to proceed with wallet.
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Paying via {config.appName} Wallet provides instant 1-tap confirmation with zero gateway redirects.
                  </p>
                </div>
              )}

              {/* METHOD: NET BANKING */}
              {selectedMethod === 'netbanking' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Select Your Bank
                  </span>

                  <div className="space-y-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank'].map((bank) => (
                      <div
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                          selectedBank === bank
                            ? 'bg-amber-400/15 border-amber-400 text-white font-bold'
                            : 'bg-black/40 border-white/5 text-neutral-300 hover:border-white/20'
                        }`}
                      >
                        <span>{bank}</span>
                        {selectedBank === bank && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* METHOD: CASH ON DELIVERY */}
              {selectedMethod === 'cash' && (
                <div className="p-4 rounded-2xl bg-[#141520] border border-white/10 space-y-3 animate-in fade-in duration-150">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Cash on Task Completion
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Hand over {config.currencySymbol}{amount} cash directly to your Task Partner once your errand items are delivered and verified with your OTP Delivery PIN.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Exact change recommended for swift completion</span>
                  </div>
                </div>
              )}

              {/* Submit Pay Button */}
              <button
                type="button"
                onClick={handleInitiatePayment}
                disabled={selectedMethod === 'wallet' && walletBalance < amount}
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-[0_2px_20px_rgba(250,204,21,0.4)] transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>
                  {selectedMethod === 'cash'
                    ? `Confirm Booking with Cash (${config.currencySymbol}${amount})`
                    : `Pay ${config.currencySymbol}${amount} Securely`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

        {/* Gateway Footer */}
        <div className="p-3.5 px-6 border-t border-white/10 bg-[#12131d] flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>256-Bit SSL End-to-End Encrypted Checkout</span>
          </div>
          <span>Supported by Razorpay, Stripe & NPCI UPI</span>
        </div>

      </div>
    </div>
  );
};
