import React, { useState } from 'react';
import { 
  Lock, 
  ShieldAlert, 
  KeyRound, 
  ArrowRight, 
  X, 
  Building2, 
  CheckCircle2, 
  Mail, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

// Strictly authorized company administrator accounts permitted to request password reset
const AUTHORIZED_ADMIN_EMAILS = [
  'dinagtgf01@gmail.com',
  'girmagttdf02@gmail.com',
  'ananiaberasut299@gmail.com'
];

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated
}) => {
  const [viewMode, setViewMode] = useState<'login' | 'forgot-email' | 'reset-code'>('login');
  
  // Login form state
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password & reset state
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle standard password login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.loginAdmin(password.trim());
      if (res.success) {
        setIsLoading(false);
        setPassword('');
        onAuthenticated();
        onClose();
      } else {
        setIsLoading(false);
        setError(res.error || 'Invalid administrator password. Only authorized company personnel may access.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('Authentication error. Please check your credentials.');
    }
  };

  // Step 1: Request password reset via email
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice(null);

    const emailInput = resetEmail.trim().toLowerCase();
    if (!emailInput) {
      setError('Please provide your company administrator email address.');
      return;
    }

    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(emailInput);
    if (!isAuthorized) {
      setError('Access restricted: This email is not authorized for administrator password reset.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.requestAdminReset(resetEmail.trim());
      setIsLoading(false);
      if (res.success) {
        setGeneratedCode(res.code || '849201');
        setVerificationCode(res.code || '');
        setViewMode('reset-code');
        setSuccessNotice('Verification code successfully generated.');
      } else {
        setError(res.error || 'Unable to generate reset code.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('Failed to dispatch password reset. Please try again.');
    }
  };

  // Step 2: Set new password with code
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailInput = resetEmail.trim().toLowerCase();
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(emailInput);
    if (!isAuthorized) {
      setError('Access restricted: Unauthorized administrator email.');
      return;
    }

    if (!verificationCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.resetAdminPassword(resetEmail.trim(), verificationCode.trim(), newPassword.trim());
      setIsLoading(false);
      if (res.success) {
        setSuccessNotice('Admin password successfully updated! Unlocking Product Uploading Page...');
        setTimeout(() => {
          onAuthenticated();
          onClose();
          // Reset states
          setViewMode('login');
          setPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setGeneratedCode(null);
          setSuccessNotice(null);
        }, 900);
      } else {
        setError(res.error || 'Invalid verification code. Please check the code dispatched to your email.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('Failed to update password. Please try again.');
    }
  };

  const handleSwitchToForgot = () => {
    setError('');
    setSuccessNotice(null);
    setViewMode('forgot-email');
  };

  const handleBackToLogin = () => {
    setError('');
    setSuccessNotice(null);
    setViewMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-[#072b4f] px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold tracking-widest text-cyan-300 uppercase">
              Company &amp; Admin Access
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-white tracking-tight">
            {viewMode === 'login' && 'Product Uploading & Editing Page'}
            {viewMode === 'forgot-email' && 'Reset Admin Password'}
            {viewMode === 'reset-code' && 'Set New Admin Password'}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            {viewMode === 'login' && 'Restricted portal for company administrators to upload new products and edit catalog hardware.'}
            {viewMode === 'forgot-email' && 'Enter your administrative email to receive a secure password reset verification code.'}
            {viewMode === 'reset-code' && 'Enter the 6-digit code dispatched to your email and configure your new admin password.'}
          </p>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: STANDARD PASSWORD LOGIN */}
        {/* ============================================================== */}
        {viewMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successNotice && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successNotice}</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Admin Security Password
                </label>
                <button
                  type="button"
                  onClick={handleSwitchToForgot}
                  className="text-xs font-semibold text-[#0072BC] hover:text-[#005B99] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0072BC] focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Protected Company Zone
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  Default key: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">gtec2026</code>
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0072BC] hover:bg-[#005B99] disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Unlock Product Page'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: FORGOT PASSWORD - REQUEST RESET VIA EMAIL */}
        {/* ============================================================== */}
        {viewMode === 'forgot-email' && (
          <form onSubmit={handleRequestReset} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#0072BC] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Email Password Reset</strong>
                <span>We will dispatch a secure 6-digit verification code to your registered admin email address to create a new password.</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter administrator email address..."
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0072BC] focus:bg-white transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Enter your authorized company administrator email to receive a password reset code.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
              <button
                type="submit"
                disabled={isLoading || !resetEmail.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0072BC] hover:bg-[#005B99] disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? 'Dispatching...' : 'Send Reset Code'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: ENTER CODE & SET NEW PASSWORD */}
        {/* ============================================================== */}
        {viewMode === 'reset-code' && (
          <form onSubmit={handleResetPassword} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Generated Code Security Display Banner */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verification Code Dispatched
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Enter your 6-digit security code and your desired new administrator password below.
              </p>
              {generatedCode && (
                <div className="pt-1.5 flex items-center gap-2">
                  <span className="text-[11px] text-emerald-700 font-semibold">Security Reset Code:</span>
                  <span className="font-mono text-sm font-extrabold tracking-widest text-[#0072BC] bg-white px-2 py-0.5 rounded border border-emerald-300">
                    {generatedCode}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                6-Digit Verification Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="e.g. 849201"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                autoFocus
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-base tracking-widest font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072BC] focus:bg-white text-center font-bold"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Admin Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password (min. 4 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072BC] focus:bg-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password *
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072BC] focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isLoading || !verificationCode || !newPassword || !confirmPassword}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting...' : 'Save & Enter Admin'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Footer info bar */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            G Tec. Technology B2B Management
          </span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Password Protected
          </span>
        </div>
      </div>
    </div>
  );
};
