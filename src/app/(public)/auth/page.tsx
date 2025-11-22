"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import SplinePlaceholder from '@/components/SplinePlaceholder';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Github } from 'lucide-react';
import { login, register } from '@/api/auth';

interface AuthProps {
  // setIsAuthenticated is no longer needed as we redirect
}

const Auth: React.FC = () => {
  const router = useRouter();
  const [view, setView] = useState<'login' | 'signup' | 'otp'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      // setIsAuthenticated(true); // handled by AuthGuard/Session
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register(fullName, email, password);
      // For now, log the user in immediately after registration
      // setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = () => {
    // Placeholder for future OTP / password reset integration
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-deep"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-ocean/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-teal/10 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10 h-[80vh] items-center">
        
        {/* Left: 3D Visuals */}
        <div className="hidden lg:flex flex-col justify-center h-full relative">
          <div className="absolute top-10 left-0 z-20">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean to-teal flex items-center justify-center text-white font-bold shadow-lg shadow-ocean/20">
                  SM
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">StockMaster</span>
             </div>
             <h1 className="text-5xl font-bold leading-tight mb-4">
               Secure Access to <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean to-teal">Global Inventory</span>
             </h1>
             <p className="text-slate-400 max-w-md text-lg">
               Manage your supply chain with enterprise-grade security and real-time analytics.
             </p>
          </div>
          <div className="h-full w-full opacity-80 translate-x-20">
            <SplinePlaceholder type="hero" />
          </div>
        </div>

        {/* Right: Auth Card */}
        <div className="flex justify-center lg:justify-end">
          <GlassCard className="w-full max-w-md p-8 backdrop-blur-xl border-white/10 shadow-2xl">
            
            {view === 'login' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400 mb-3 text-sm">Enter your credentials to access your workspace.</p>
                {error && (
                  <p className="text-sm text-rose-400 mb-3 text-left">{error}</p>
                )}
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 group-focus-within:text-ocean transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-deep/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-ocean outline-none transition-all" 
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                       <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Password</label>
                       <a href="#" className="text-xs text-ocean hover:text-white transition-colors">Forgot Password?</a>
                    </div>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 group-focus-within:text-ocean transition-colors" />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-deep/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-ocean outline-none transition-all" 
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <Button variant="primary" className="w-full py-3" isLoading={isLoading}>
                    Sign In <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                  <span className="text-xs text-slate-500">OR CONTINUE WITH</span>
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm text-white">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Google
                  </button>
                   <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm text-white">
                    <Github className="w-4 h-4" />
                    Github
                  </button>
                </div>

                <p className="text-center mt-8 text-sm text-slate-400">
                  Don't have an account? <button onClick={() => setView('signup')} className="text-ocean hover:text-white font-medium transition-colors">Sign up</button>
                </p>
              </div>
            )}

            {view === 'signup' && (
              <div className="animate-fade-in">
                 <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                 <p className="text-slate-400 mb-6 text-sm">Start managing your inventory in seconds.</p>
                 
                 <form onSubmit={handleSignup} className="space-y-4">
                   <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Full Name</label>
                    <div className="relative group">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 group-focus-within:text-ocean transition-colors" />
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-deep/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-ocean outline-none transition-all" 
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                   <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 group-focus-within:text-ocean transition-colors" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-deep/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-ocean outline-none transition-all" 
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 group-focus-within:text-ocean transition-colors" />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-deep/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-ocean outline-none transition-all" 
                        placeholder="Create a strong password"
                      />
                    </div>
                    {/* Password Strength Meter Mock */}
                    <div className="flex gap-1 mt-2 h-1">
                      <div className="flex-1 bg-emerald-500 rounded-full"></div>
                      <div className="flex-1 bg-emerald-500 rounded-full"></div>
                      <div className="flex-1 bg-slate-700 rounded-full"></div>
                      <div className="flex-1 bg-slate-700 rounded-full"></div>
                    </div>
                  </div>

                  <Button variant="primary" className="w-full py-3 mt-2" isLoading={isLoading}>
                    Create Account <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                 </form>

                 <p className="text-center mt-6 text-sm text-slate-400">
                  Already have an account? <button onClick={() => setView('login')} className="text-ocean hover:text-white font-medium transition-colors">Log in</button>
                </p>
              </div>
            )}

            {view === 'otp' && (
              <div className="animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full bg-ocean/10 flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-ocean" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verify Email</h2>
                <p className="text-slate-400 mb-8 text-sm">
                  We sent a verification code to <span className="text-white font-medium">email@example.com</span>. Enter it below.
                </p>

                <div className="flex justify-center gap-3 mb-8">
                  {[1, 2, 3, 4, 5, 6].map((_, i) => (
                    <input 
                      key={i}
                      type="text" 
                      maxLength={1}
                      className="w-10 h-12 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-lg focus:border-ocean outline-none text-white transition-all focus:bg-white/10"
                    />
                  ))}
                </div>

                <Button variant="primary" className="w-full py-3" onClick={handleVerify} isLoading={isLoading}>
                  Verify & Continue
                </Button>

                <p className="mt-6 text-sm text-slate-400">
                  Didn't receive code? <button className="text-ocean hover:text-white font-medium transition-colors">Resend</button>
                </p>
                <button onClick={() => setView('signup')} className="mt-4 text-xs text-slate-500 hover:text-white">
                  Use a different email
                </button>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Auth;