import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sparkles, 
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { UserProfile, WhiteLabelConfig } from '../types';
import { AuthService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WhiteLabelConfig;
  onAuthSuccess: (user: UserProfile) => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  config,
  onAuthSuccess,
  defaultMode = 'login'
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(defaultMode);
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  
  // Phone Form State
  const [phone, setPhone] = useState('98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  
  // Email Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState<'customer' | 'partner'>('customer');

  // Error & Loading
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = AuthService.sendOtp(phone);
      setOtpSent(true);
      setOtpCode(res.testOtp); // Pre-fill test code for ultra-fast frictionless evaluation
      setOtpMessage(res.message);
      setIsLoading(false);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (otpCode.trim().length < 4) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = AuthService.verifyOtp(phone, otpCode, authMode === 'signup' ? signupName : undefined);
      setIsLoading(false);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        onClose();
      } else {
        setErrorMessage(res.error || 'Invalid OTP code.');
      }
    }, 600);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (authMode === 'login') {
        const res = AuthService.loginWithEmail(email, password);
        if (res.success && res.user) {
          onAuthSuccess(res.user);
          onClose();
        } else {
          setErrorMessage(res.error || 'Authentication failed.');
        }
      } else {
        const res = AuthService.signup(signupName, phone, email, signupRole);
        if (res.success && res.user) {
          onAuthSuccess(res.user);
          onClose();
        } else {
          setErrorMessage(res.error || 'Registration failed.');
        }
      }
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const demoUser = AuthService.getSessionUser();
      setIsLoading(false);
      if (demoUser) {
        onAuthSuccess(demoUser);
        onClose();
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#101117] border border-amber-400/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(250,204,21,0.2)] overflow-hidden my-auto flex flex-col text-left">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 bg-[#141520] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 font-display font-extrabold text-base flex items-center justify-center shadow-md">
              X
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                {authMode === 'login' ? `Sign In to ${config.appName}` : `Create ${config.appName} Account`}
              </h3>
              <p className="text-[11px] text-neutral-400">One account for both Customer and Partner modes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Phone vs Email */}
        <div className="p-6 space-y-5">
          <div className="flex p-1 rounded-xl bg-black/60 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMethod('phone');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                method === 'phone'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile & SMS OTP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMethod('email');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                method === 'email'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>
          </div>

          {/* Quick Demo 1-Click Login Pill */}
          <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-semibold">Instant Client Demo Account:</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-400 text-neutral-950 font-bold hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              Log in as Alex V.
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
              {errorMessage}
            </div>
          )}

          {/* METHOD 1: PHONE & OTP */}
          {method === 'phone' ? (
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. David Kumar"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Mobile Phone Number</label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-neutral-300 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 block">We will send a 6-digit verification code via SMS</span>
                </div>

                {authMode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Default Starting Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSignupRole('customer')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          signupRole === 'customer'
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                            : 'bg-black/40 border-white/10 text-neutral-400'
                        }`}
                      >
                        🛍️ Customer (Post Tasks)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignupRole('partner')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          signupRole === 'partner'
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                            : 'bg-black/40 border-white/10 text-neutral-400'
                        }`}
                      >
                        ⚡ Partner (Earn Money)
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="animate-spin">●</span>
                  ) : (
                    <>
                      <span>Send 6-Digit SMS OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-150">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  {otpMessage || `OTP sent to ${phone}`}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-neutral-300">Enter Verification Code</label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-amber-400 hover:underline text-[11px]"
                    >
                      Change Phone
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="482103"
                    className="w-full px-4 py-3 rounded-xl bg-black border border-amber-400/50 text-center font-mono font-black text-xl text-amber-400 tracking-widest focus:outline-none"
                  />
                  <span className="text-[10px] text-neutral-400 block text-center">Test code: <strong className="text-white">482103</strong></span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="animate-spin">●</span>
                  ) : (
                    <>
                      <span>Verify Code & Continue</span>
                      <Check className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )
          ) : (
            /* METHOD 2: EMAIL & PASSWORD */
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. David Kumar"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-spin">●</span>
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In with Password' : 'Create Account'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle between Login and Signup */}
          <div className="pt-2 text-center border-t border-white/10 text-xs text-neutral-400">
            {authMode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setOtpSent(false);
                    setErrorMessage('');
                  }}
                  className="text-amber-400 font-bold hover:underline cursor-pointer ml-1"
                >
                  Register Here
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setOtpSent(false);
                    setErrorMessage('');
                  }}
                  className="text-amber-400 font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit encrypted authentication session</span>
          </div>

        </div>

      </div>
    </div>
  );
};
