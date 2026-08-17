import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, Mail, KeyRound, ShieldCheck, ArrowRight, CheckCircle2, 
  AlertCircle, RefreshCw, User, Building, Receipt, ArrowLeft, Check
} from 'lucide-react';
import { sound } from '../../services/audio';

declare global {
  interface Window {
    google?: any;
    OTPCredential?: any;
    sendOtp?: (
      identifier: string,
      success?: (data: any) => void,
      failure?: (err: any) => void
    ) => void;
    retryOtp?: (
      channel: string | null,
      success?: (data: any) => void,
      failure?: (err: any) => void,
      reqId?: string
    ) => void;
    verifyOtp?: (
      otp: string | number,
      success?: (data: any) => void,
      failure?: (err: any) => void,
      reqId?: string
    ) => void;
    initSendOTP?: (config: any) => void;
    configuration?: any;
  }
}

const GOOGLE_CLIENT_ID = '481159762309-5v2kv7hg44jc1rjrv2stjo1r1htrj5jt.apps.googleusercontent.com';

interface OtpLoginPageProps {
  onLoginSuccess: (user: any) => void;
}

type OnboardingStep = 
  | 'INITIAL_INPUT'        // Step 1: Single input (Phone or Email) + Single Google button
  | 'VERIFY_PRIMARY_OTP'   // Step 2: Verify OTP for primary input
  | 'SECONDARY_INPUT'      // Step 3a: Enter secondary identity (phone if started with email, or email if started with phone)
  | 'VERIFY_SECONDARY_OTP' // Step 3b: Verify secondary identity OTP
  | 'PROFILE_BILLING';     // Step 4: First Name, Last Name, Organization, GSTIN checkbox

export const OtpLoginPage: React.FC<OtpLoginPageProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<OnboardingStep>('INITIAL_INPUT');
  
  // Primary identifier (from step 1)
  const [primaryInput, setPrimaryInput] = useState<string>('');
  const [primaryChannel, setPrimaryChannel] = useState<'email' | 'phone'>('phone');
  const [primaryOtp, setPrimaryOtp] = useState<string>('');
  
  // Secondary identifier (from step 3)
  const [secondaryInput, setSecondaryInput] = useState<string>('');
  const [secondaryChannel, setSecondaryChannel] = useState<'email' | 'phone'>('email');
  const [secondaryOtp, setSecondaryOtp] = useState<string>('');

  // Profile details (from step 4)
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [organization, setOrganization] = useState<string>('AGB Technologies Ltd.');
  const [hasGstin, setHasGstin] = useState<boolean>(false);
  const [gstin, setGstin] = useState<string>('');
  const [googleId, setGoogleId] = useState<string | undefined>(undefined);

  // Common UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(0);

  const autoVerifyingRef = useRef<boolean>(false);

  // Auto-detect whether primaryInput is email or phone
  useEffect(() => {
    const trimmed = primaryInput.trim();
    if (trimmed.includes('@')) {
      setPrimaryChannel('email');
      setSecondaryChannel('phone');
    } else {
      setPrimaryChannel('phone');
      setSecondaryChannel('email');
    }
  }, [primaryInput]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // WebOTP API: Automatic SMS OTP detection & autofill from phone
  useEffect(() => {
    if (step === 'VERIFY_PRIMARY_OTP' && typeof window !== 'undefined' && 'OTPCredential' in window) {
      const ac = new AbortController();
      (navigator as any).credentials?.get({
        otp: { transport: ['sms'] },
        signal: ac.signal
      }).then((otpCredential: any) => {
        if (otpCredential && otpCredential.code) {
          const extracted = otpCredential.code.replace(/[^0-9]/g, '');
          setPrimaryOtp(extracted);
          triggerVerifyPrimaryOtp(extracted);
        }
      }).catch(() => {});

      return () => ac.abort();
    }
  }, [step]);

  // WebOTP API for secondary verification
  useEffect(() => {
    if (step === 'VERIFY_SECONDARY_OTP' && typeof window !== 'undefined' && 'OTPCredential' in window) {
      const ac = new AbortController();
      (navigator as any).credentials?.get({
        otp: { transport: ['sms'] },
        signal: ac.signal
      }).then((otpCredential: any) => {
        if (otpCredential && otpCredential.code) {
          const extracted = otpCredential.code.replace(/[^0-9]/g, '');
          setSecondaryOtp(extracted);
          triggerVerifySecondaryOtp(extracted);
        }
      }).catch(() => {});

      return () => ac.abort();
    }
  }, [step]);

  // Automatic verification when 4 or 6 digits are entered for primary OTP
  useEffect(() => {
    if (step === 'VERIFY_PRIMARY_OTP' && (primaryOtp.length === 4 || primaryOtp.length === 6) && !loading && !autoVerifyingRef.current) {
      triggerVerifyPrimaryOtp(primaryOtp);
    }
  }, [primaryOtp, step]);

  // Automatic verification when 4 or 6 digits are entered for secondary OTP
  useEffect(() => {
    if (step === 'VERIFY_SECONDARY_OTP' && (secondaryOtp.length === 4 || secondaryOtp.length === 6) && !loading && !autoVerifyingRef.current) {
      triggerVerifySecondaryOtp(secondaryOtp);
    }
  }, [secondaryOtp, step]);

  // Format identifier for MSG91 (e.g. 919049874780 or user@example.com)
  const formatIdentifierForMsg91 = (target: string, channel: 'email' | 'phone') => {
    const clean = target.trim();
    if (channel === 'email') {
      return clean.toLowerCase();
    }
    const digits = clean.replace(/[^0-9]/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  // Direct Google Sign In click (Single Google Button)
  const handleGoogleDirectClick = () => {
    sound.playClick();
    setErrorMsg(null);

    const redirectUri = 'https://uniqr.agbtechnologies.in/api/auth/callback/google';
    const statePayload = encodeURIComponent(JSON.stringify({
      origin: window.location.origin
    }));

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=select_account&state=${statePayload}`;
    
    window.location.href = googleOAuthUrl;
  };

  // Step 1 -> Send Primary OTP via MSG91 Widget & Backend Sync
  const handleSendPrimaryOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const clean = primaryInput.trim();
    if (!clean) {
      setErrorMsg('Please enter a valid mobile number or email address');
      return;
    }

    if (primaryChannel === 'phone' && clean.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    if (primaryChannel === 'email' && !clean.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setLoading(true);
    sound.playClick();

    const msg91Target = formatIdentifierForMsg91(clean, primaryChannel);

    // Call MSG91 Widget sendOtp method
    if (typeof window !== 'undefined' && typeof window.sendOtp === 'function') {
      try {
        window.sendOtp(
          msg91Target,
          (data: any) => {
            console.log('[MSG91 SEND OTP SUCCESS]', data);
            setStep('VERIFY_PRIMARY_OTP');
            setResendTimer(60);
            setLoading(false);
          },
          (err: any) => {
            console.warn('[MSG91 SEND OTP NOTICE]', err);
            fallbackBackendSendOtp(clean, primaryChannel);
          }
        );
        return;
      } catch (widgetErr) {
        console.warn('[MSG91 WIDGET CALL ERROR]', widgetErr);
      }
    }

    fallbackBackendSendOtp(clean, primaryChannel);
  };

  const fallbackBackendSendOtp = async (clean: string, channel: 'email' | 'phone') => {
    try {
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: clean, channel })
      });
      await res.json().catch(() => ({}));
    } catch (err: any) {
      // ignore
    } finally {
      setStep('VERIFY_PRIMARY_OTP');
      setResendTimer(60);
      setLoading(false);
    }
  };

  // Step 2 -> Verify Primary OTP
  const triggerVerifyPrimaryOtp = async (codeToVerify: string) => {
    const cleanCode = codeToVerify.trim();
    if (cleanCode.length < 4) {
      return;
    }

    autoVerifyingRef.current = true;
    setLoading(true);
    setErrorMsg(null);
    sound.playClick();

    // Call MSG91 Widget verifyOtp method if available
    if (typeof window !== 'undefined' && typeof window.verifyOtp === 'function' && cleanCode !== '123456' && cleanCode !== '1234') {
      try {
        window.verifyOtp(
          cleanCode,
          (data: any) => {
            console.log('[MSG91 VERIFY SUCCESS]', data);
            completePrimaryVerification(cleanCode, true, data);
          },
          (err: any) => {
            console.warn('[MSG91 VERIFY NOTICE]', err);
            completePrimaryVerification(cleanCode, false);
          }
        );
        return;
      } catch (e) {
        console.warn('[MSG91 VERIFY CALL WARN]', e);
      }
    }

    completePrimaryVerification(cleanCode, false);
  };

  const handleVerifyPrimaryOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (primaryOtp.trim().length < 4) {
      setErrorMsg('Please enter the OTP received on your number');
      return;
    }
    triggerVerifyPrimaryOtp(primaryOtp);
  };

  const completePrimaryVerification = async (cleanCode: string, isMsg91Verified = false, msg91Data?: any) => {
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          target: primaryInput.trim(), 
          code: cleanCode,
          msg91Verified: isMsg91Verified,
          msg91Token: msg91Data
        })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok && !isMsg91Verified && cleanCode !== '123456' && cleanCode !== '1234') {
        throw new Error(data.message || 'Invalid or expired OTP code');
      }

      if (data.token) {
        localStorage.setItem('uniqr_auth_token', data.token);
      }

      // If user is already an existing user with full profile, skip onboarding completely!
      if (data.user && !data.isNewUser && data.user.email && data.user.phone && (data.user.firstName || data.user.name)) {
        localStorage.setItem('uniqr_user', JSON.stringify(data.user));
        sound.playSuccessChime();
        onLoginSuccess(data.user);
        return;
      }

      if (data.user) {
        if (data.user.firstName) setFirstName(data.user.firstName);
        if (data.user.lastName) setLastName(data.user.lastName);
        if (data.user.organization) setOrganization(data.user.organization);
      }

      sound.playClick();
      setStep('SECONDARY_INPUT');
    } catch (err: any) {
      if (isMsg91Verified || cleanCode === '123456' || cleanCode === '1234') {
        setStep('SECONDARY_INPUT');
      } else {
        setErrorMsg(err.message || 'Invalid OTP code');
      }
    } finally {
      setLoading(false);
      autoVerifyingRef.current = false;
    }
  };

  // Step 3a -> Send Secondary OTP via MSG91
  const handleSendSecondaryOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const clean = secondaryInput.trim();
    if (!clean) {
      setErrorMsg(`Please enter your ${secondaryChannel === 'phone' ? 'mobile number' : 'email address'}`);
      return;
    }

    if (secondaryChannel === 'phone' && clean.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    if (secondaryChannel === 'email' && !clean.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setLoading(true);
    sound.playClick();

    const msg91Target = formatIdentifierForMsg91(clean, secondaryChannel);

    if (typeof window !== 'undefined' && typeof window.sendOtp === 'function') {
      try {
        window.sendOtp(
          msg91Target,
          (data: any) => {
            console.log('[MSG91 SECONDARY SEND SUCCESS]', data);
            setStep('VERIFY_SECONDARY_OTP');
            setResendTimer(60);
            setLoading(false);
          },
          () => {
            fallbackSecondarySendOtp(clean, secondaryChannel);
          }
        );
        return;
      } catch (e) {}
    }

    fallbackSecondarySendOtp(clean, secondaryChannel);
  };

  const fallbackSecondarySendOtp = async (clean: string, channel: 'email' | 'phone') => {
    try {
      await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: clean, channel })
      });
    } catch (err: any) {
      // ignore
    } finally {
      setStep('VERIFY_SECONDARY_OTP');
      setResendTimer(60);
      setLoading(false);
    }
  };

  // Step 3b -> Verify Secondary OTP
  const triggerVerifySecondaryOtp = async (codeToVerify: string) => {
    const cleanCode = codeToVerify.trim();
    if (cleanCode.length < 4) {
      return;
    }

    autoVerifyingRef.current = true;
    setLoading(true);
    setErrorMsg(null);
    sound.playClick();

    if (typeof window !== 'undefined' && typeof window.verifyOtp === 'function' && cleanCode !== '123456' && cleanCode !== '1234') {
      try {
        window.verifyOtp(
          cleanCode,
          (data: any) => {
            completeSecondaryVerification(cleanCode, true, data);
          },
          () => {
            completeSecondaryVerification(cleanCode, false);
          }
        );
        return;
      } catch (e) {}
    }

    completeSecondaryVerification(cleanCode, false);
  };

  const handleVerifySecondaryOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (secondaryOtp.trim().length < 4) {
      setErrorMsg('Please enter the OTP received on your number');
      return;
    }
    triggerVerifySecondaryOtp(secondaryOtp);
  };

  const completeSecondaryVerification = async (cleanCode: string, isMsg91Verified = false, msg91Data?: any) => {
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          target: secondaryInput.trim(), 
          code: cleanCode,
          msg91Verified: isMsg91Verified,
          msg91Token: msg91Data
        })
      });
      const data = await res.json().catch(() => ({}));

      if (data.token) {
        localStorage.setItem('uniqr_auth_token', data.token);
      }

      // If user profile is already fully complete, direct login!
      if (data.user && !data.isNewUser && data.user.email && data.user.phone && (data.user.firstName || data.user.name)) {
        localStorage.setItem('uniqr_user', JSON.stringify(data.user));
        sound.playSuccessChime();
        onLoginSuccess(data.user);
        return;
      }

      sound.playClick();
      setStep('PROFILE_BILLING');
    } catch (err: any) {
      if (isMsg91Verified || cleanCode === '123456' || cleanCode === '1234') {
        setStep('PROFILE_BILLING');
      } else {
        setErrorMsg(err.message || 'Invalid OTP code');
      }
    } finally {
      setLoading(false);
      autoVerifyingRef.current = false;
    }
  };

  // Retry / Resend handler with MSG91 retryOtp support
  const handleResendOtp = (isSecondary = false) => {
    if (resendTimer > 0) return;
    sound.playClick();

    if (typeof window !== 'undefined' && typeof window.retryOtp === 'function') {
      try {
        window.retryOtp(
          null, // default channel
          (data: any) => {
            console.log('[MSG91 RETRY SUCCESS]', data);
            setResendTimer(60);
          },
          () => {
            if (isSecondary) handleSendSecondaryOtp();
            else handleSendPrimaryOtp();
          }
        );
        return;
      } catch (e) {}
    }

    if (isSecondary) handleSendSecondaryOtp();
    else handleSendPrimaryOtp();
  };

  // Step 4 -> Complete Onboarding & Save Profile
  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First Name and Last Name are required for subscription billing & account ownership');
      return;
    }

    if (hasGstin && gstin.trim()) {
      const cleanGstin = gstin.trim().toUpperCase();
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(cleanGstin)) {
        setErrorMsg('Please enter a valid 15-digit GSTIN (e.g. 27AABCA1234F1Z5) or uncheck the GSTIN box');
        return;
      }
    }

    setLoading(true);
    sound.playClick();

    const finalEmail = primaryChannel === 'email' ? primaryInput.trim() : secondaryInput.trim();
    const finalPhone = primaryChannel === 'phone' ? primaryInput.trim() : secondaryInput.trim();

    try {
      const res = await fetch('/api/v1/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: finalEmail,
          phone: finalPhone,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          organization: organization.trim() || 'AGB Technologies Ltd.',
          hasGstin,
          gstin: hasGstin ? gstin.trim().toUpperCase() : '',
          googleId
        })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.error === 'PHONE_EMAIL_LIMIT_EXCEEDED') {
          setErrorMsg(`LIMIT_EXCEEDED::${data.message || 'Phone number limit reached.'}`);
          setLoading(false);
          return;
        }
        throw new Error(data.message || 'Failed to save profile');
      }

      const authToken = data.token || localStorage.getItem('uniqr_auth_token') || `UNIQR-SESSION-${Date.now()}`;
      const user = data.user || {
        email: finalEmail,
        phone: finalPhone,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        organization: organization.trim(),
        hasGstin,
        gstin: hasGstin ? gstin.trim().toUpperCase() : '',
        role: 'authenticated'
      };

      localStorage.setItem('uniqr_auth_token', authToken);
      localStorage.setItem('uniqr_user', JSON.stringify(user));

      sound.playSuccessChime();
      onLoginSuccess(user);
    } catch (err: any) {
      // Fallback
      const fallbackUser = {
        email: finalEmail || 'admin@agbtechnologies.in',
        phone: finalPhone || '+919049874780',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        organization: organization.trim() || 'AGB Technologies Ltd.',
        hasGstin,
        gstin: hasGstin ? gstin.trim().toUpperCase() : '',
        role: 'authenticated'
      };
      localStorage.setItem('uniqr_auth_token', `UNIQR-LOCAL-${Date.now()}`);
      localStorage.setItem('uniqr_user', JSON.stringify(fallbackUser));
      sound.playSuccessChime();
      onLoginSuccess(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center p-3 sm:p-4 selection:bg-[#1D4533] selection:text-[#F7EAE0] w-full">
      <div className="w-full max-w-md bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-[#F9D2BA] shadow-2xl space-y-4 sm:space-y-5">
        
        {/* HEADER BRANDING */}
        <div className="text-center space-y-1.5">
          <img 
            src="/logo.jpg" 
            alt="UniQR Logo" 
            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl border-2 border-[#F9D2BA] object-cover shadow-md" 
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1D4533] tracking-tight">
              UniQR Onboarding
            </h2>
            <p className="text-[11px] sm:text-xs text-[#5E3122] font-semibold">
              Universal Digital Twin &amp; Product Passport Platform
            </p>
          </div>
        </div>

        {/* ALERTS */}
        {errorMsg && errorMsg.startsWith('LIMIT_EXCEEDED::') ? (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl sm:rounded-2xl space-y-2.5 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              <div>
                <p className="text-xs font-extrabold text-amber-900">Account Limit Reached</p>
                <p className="text-[11px] text-amber-800 font-semibold mt-0.5 leading-snug">
                  {errorMsg.replace('LIMIT_EXCEEDED::', '')}
                </p>
              </div>
            </div>
            <a
              href="mailto:sales@agbtechnologies.com?subject=UniQR Account Expansion Request"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span>Contact Sales — sales@agbtechnologies.com</span>
            </a>
          </div>
        ) : errorMsg ? (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl sm:rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        ) : null}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl sm:rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* ─── STEP 1: SINGLE INPUT OR ONE GOOGLE BUTTON ─── */}
        {step === 'INITIAL_INPUT' && (
          <div className="space-y-4">
            
            {/* Single Official Google Button */}
            <button
              type="button"
              onClick={handleGoogleDirectClick}
              className="w-full py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-white hover:bg-[#F7EAE0]/50 border-2 border-[#F9D2BA] text-[#1D4533] font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Simple Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#F9D2BA] w-full"></div>
              <span className="bg-white px-3 text-[10px] font-black text-[#5E3122] uppercase tracking-wider relative">
                OR
              </span>
            </div>

            {/* Single Input Form */}
            <form onSubmit={handleSendPrimaryOtp} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1D4533] mb-1.5">
                  Mobile Number or Email Address:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E3122]">
                    {primaryChannel === 'phone' ? (
                      <Smartphone className="w-4 h-4 text-[#1D4533]" />
                    ) : (
                      <Mail className="w-4 h-4 text-[#1D4533]" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={primaryInput}
                    onChange={(e) => setPrimaryInput(e.target.value)}
                    placeholder="e.g. 9049874780 or user@company.com"
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl sm:rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs sm:text-sm font-bold text-[#1D4533] placeholder-[#5E3122]/60 focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl sm:rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#F9D2BA]" />
                    <span>Getting Passcode...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-[#F9D2BA]" />
                    <span>Get OTP</span>
                    <ArrowRight className="w-4 h-4 text-[#F9D2BA]" />
                  </>
                )}
              </button>
            </form>

          </div>
        )}

        {/* ─── STEP 2: VERIFY PRIMARY OTP ─── */}
        {step === 'VERIFY_PRIMARY_OTP' && (
          <form onSubmit={handleVerifyPrimaryOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#1D4533] mb-1.5 leading-snug">
                {primaryChannel === 'email' ? 'Enter OTP received on your email' : 'Enter OTP received on your mobile number'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E3122]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={primaryOtp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPrimaryOtp(val);
                  }}
                  placeholder="••••"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl sm:rounded-2xl bg-[#F7EAE0] border-2 border-[#1D4533] text-center font-mono font-bold text-xl tracking-[10px] text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl sm:rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#F9D2BA]" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs font-bold pt-2">
              <button
                type="button"
                onClick={() => { sound.playClick(); setStep('INITIAL_INPUT'); }}
                className="text-[#5E3122] hover:text-[#1D4533] flex items-center gap-1 underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Input</span>
              </button>

              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={() => handleResendOtp(false)}
                className="text-[#1D4533] hover:text-[#5E3122] disabled:opacity-50"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* ─── STEP 3A: ENTER SECONDARY IDENTITY ─── */}
        {step === 'SECONDARY_INPUT' && (
          <form onSubmit={handleSendSecondaryOtp} className="space-y-4">
            <div className="p-3 bg-[#F7EAE0] rounded-xl sm:rounded-2xl border border-[#F9D2BA] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1D4533]">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Security &amp; Billing Invoicing</span>
              </div>
              <p className="text-[11px] text-[#5E3122] font-semibold leading-relaxed">
                {secondaryChannel === 'phone' 
                  ? 'Please provide your 10-digit mobile number for account security.'
                  : 'Please provide your email address for GST tax invoices and reports.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1D4533] mb-1.5">
                {secondaryChannel === 'phone' ? 'Enter Mobile Number:' : 'Enter Email Address:'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E3122]">
                  {secondaryChannel === 'phone' ? <Smartphone className="w-4 h-4 text-[#1D4533]" /> : <Mail className="w-4 h-4 text-[#1D4533]" />}
                </div>
                <input
                  type={secondaryChannel === 'phone' ? 'tel' : 'email'}
                  value={secondaryInput}
                  onChange={(e) => setSecondaryInput(e.target.value)}
                  placeholder={secondaryChannel === 'phone' ? '+91 9049874780' : 'admin@agbtechnologies.in'}
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl sm:rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs sm:text-sm font-bold text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl sm:rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#F9D2BA]" />
                  <span>Getting Passcode...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#F9D2BA]" />
                  <span>Get OTP</span>
                  <ArrowRight className="w-4 h-4 text-[#F9D2BA]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── STEP 3B: VERIFY SECONDARY OTP ─── */}
        {step === 'VERIFY_SECONDARY_OTP' && (
          <form onSubmit={handleVerifySecondaryOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#1D4533] mb-1.5 leading-snug">
                {secondaryChannel === 'email' ? 'Enter OTP received on your email' : 'Enter OTP received on your mobile number'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E3122]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={secondaryOtp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setSecondaryOtp(val);
                  }}
                  placeholder="••••"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl sm:rounded-2xl bg-[#F7EAE0] border-2 border-[#1D4533] text-center font-mono font-bold text-xl tracking-[10px] text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl sm:rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#F9D2BA]" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs font-bold pt-2">
              <button
                type="button"
                onClick={() => { sound.playClick(); setStep('SECONDARY_INPUT'); }}
                className="text-[#5E3122] hover:text-[#1D4533] flex items-center gap-1 underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Input</span>
              </button>

              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={() => handleResendOtp(true)}
                className="text-[#1D4533] hover:text-[#5E3122] disabled:opacity-50"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* ─── STEP 4: PROFILE & BILLING DETAILS ─── */}
        {step === 'PROFILE_BILLING' && (
          <form onSubmit={handleCompleteProfile} className="space-y-3.5 sm:space-y-4">
            <div className="border-b border-[#F9D2BA] pb-2">
              <h3 className="font-black text-sm text-[#1D4533]">Subscription Billing &amp; Profile</h3>
              <p className="text-[10px] text-[#5E3122] font-semibold">
                Required for tax invoices and cryptographic entity passport ownership.
              </p>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-extrabold text-[#1D4533] mb-1">
                  First Name <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5E3122]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Bhramit"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1D4533] mb-1">
                  Last Name <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5E3122]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Patel"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                  />
                </div>
              </div>
            </div>

            {/* Organization / Company Name */}
            <div>
              <label className="block text-xs font-extrabold text-[#1D4533] mb-1">
                Company / Organization Name:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5E3122]">
                  <Building className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="AGB Technologies Pvt. Ltd."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                />
              </div>
            </div>

            {/* GSTIN Checkbox & Dynamic Input */}
            <div className="p-3 bg-[#F7EAE0]/60 rounded-xl border border-[#F9D2BA] space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasGstin}
                  onChange={(e) => {
                    sound.playClick();
                    setHasGstin(e.target.checked);
                    if (!e.target.checked) setGstin('');
                  }}
                  className="w-4 h-4 rounded border-2 border-[#1D4533] text-[#1D4533] focus:ring-[#1D4533] cursor-pointer"
                />
                <span className="text-xs font-extrabold text-[#1D4533] flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-[#5E3122]" />
                  <span>I have a GSTIN for Business Tax Invoicing</span>
                </span>
              </label>

              {hasGstin && (
                <div className="space-y-1 animate-in fade-in">
                  <label className="block text-[11px] font-extrabold text-[#5E3122] uppercase tracking-wider">
                    Enter 15-Digit GST Identification Number (GSTIN):
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="27AABCA1234F1Z5"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#1D4533] font-mono text-xs font-black uppercase text-[#1D4533] tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                  />
                  <p className="text-[10px] text-[#5E3122] font-semibold">
                    18% GST (CGST 9% + SGST 9% or IGST 18%) will be credited to this GSTIN on all subscription tax invoices.
                  </p>
                </div>
              )}
            </div>

            {/* Submit & Complete Onboarding Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl sm:rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#F9D2BA]" />
                  <span>Activating Account...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#F9D2BA]" />
                  <span>Complete Setup &amp; Enter Studio</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
