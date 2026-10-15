import { UserProfile } from '../types';

const STORAGE_KEY = 'errandx_auth_user';

export const DEFAULT_USER: UserProfile = {
  id: 'USR-89210',
  name: 'Anand K.',
  phone: '+91 98765 43210',
  email: 'anand.k@example.com',
  avatar: 'AK',
  activeRole: 'customer',
  isPartnerApproved: true,
  walletBalance: 750,
  savedAddresses: [
    { label: 'Home', address: 'Market Street, Near Town Temple' },
    { label: 'Work', address: 'Taluk Office Road' }
  ],
  partnerRating: 4.95,
  partnerCompletedTasks: 42,
  createdAt: '2026-01-15'
};

export class AuthService {
  private static generatedOtps: Record<string, { code: string; expires: number }> = {};

  public static getSessionUser(): UserProfile | null {
    if (typeof window === 'undefined') return DEFAULT_USER;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Default to authenticated demo user so everything is pre-warmed, but allow sign out
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_USER;
    }
  }

  public static saveSession(user: UserProfile): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }

  public static clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Generates a 6-digit OTP for phone authentication
   */
  public static sendOtp(phone: string): { success: boolean; testOtp: string; message: string } {
    const formattedPhone = phone.trim();
    // Deterministic or random test OTP
    const testOtp = '482103';
    this.generatedOtps[formattedPhone] = {
      code: testOtp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    return {
      success: true,
      testOtp,
      message: `Verification OTP sent to ${formattedPhone}. (Test Code: ${testOtp})`
    };
  }

  /**
   * Verifies the OTP code
   */
  public static verifyOtp(phone: string, inputOtp: string, optionalName?: string): { success: boolean; user?: UserProfile; error?: string } {
    const formattedPhone = phone.trim();
    const existing = this.generatedOtps[formattedPhone];

    // Accept test OTP '482103' or any 6-digit OTP in test environment
    const isValid = inputOtp.trim() === '482103' || (existing && existing.code === inputOtp.trim());

    if (!isValid && inputOtp.trim().length !== 6) {
      return { success: false, error: 'Invalid 6-digit verification code. Please check SMS or use 482103.' };
    }

    const current = this.getSessionUser() || DEFAULT_USER;
    const updatedUser: UserProfile = {
      ...current,
      id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      phone: formattedPhone.startsWith('+') ? formattedPhone : `+91 ${formattedPhone}`,
      name: optionalName || current.name || 'Anand K.',
      avatar: (optionalName || current.name || 'Anand K.').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    };

    this.saveSession(updatedUser);
    delete this.generatedOtps[formattedPhone];
    return { success: true, user: updatedUser };
  }

  /**
   * Authenticates with Email & Password
   */
  public static loginWithEmail(email: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const current = this.getSessionUser() || DEFAULT_USER;
    const updatedUser: UserProfile = {
      ...current,
      email: email.trim().toLowerCase(),
      name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase())
    };

    this.saveSession(updatedUser);
    return { success: true, user: updatedUser };
  }

  /**
   * Registers a new account with single-account dual role capability
   */
  public static signup(
    name: string,
    phone: string,
    email: string,
    initialRole: 'customer' | 'partner'
  ): { success: boolean; user?: UserProfile; error?: string } {
    if (!name.trim()) return { success: false, error: 'Full name is required.' };
    if (!phone.trim()) return { success: false, error: 'Mobile number is required.' };

    const newUser: UserProfile = {
      id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      name: name.trim(),
      phone: phone.trim().startsWith('+') ? phone.trim() : `+91 ${phone.trim()}`,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      avatar: name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      activeRole: initialRole,
      isPartnerApproved: true,
      walletBalance: 500, // Welcome signup credit
      savedAddresses: [
        { label: 'Home', address: 'Market Street' }
      ],
      partnerRating: 5.0,
      partnerCompletedTasks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.saveSession(newUser);
    return { success: true, user: newUser };
  }

  /**
   * Switch roles on the same unified account (Core Requirement 2)
   */
  public static switchRole(user: UserProfile, newRole: 'customer' | 'partner'): UserProfile {
    const updated: UserProfile = {
      ...user,
      activeRole: newRole
    };
    this.saveSession(updated);
    return updated;
  }
}
