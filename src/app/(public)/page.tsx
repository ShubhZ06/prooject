"use client";
import React from 'react';
import Link from 'next/link';
import SplinePlaceholder from '@/components/SplinePlaceholder';
import { ArrowRight, Check, Box, BarChart3, Shield, Zap, Globe, Layers } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navbar Overlay for Landing */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center max-w-[1400px] mx-auto w-full">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-ocean to-teal flex items-center justify-center font-bold text-white">SM</div>
            <span className="font-bold text-xl tracking-tight text-white">StockMaster</span>
         </div>
         <Link href="/auth" className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium transition-all backdrop-blur-md text-white">
           Sign In
         </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Text Content */}
          <div className="space-y-8 z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean/10 border border-ocean/20 text-ocean text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-ocean animate-pulse"></span>
              Next Gen IMS
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
              Inventory <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean to-teal">
                Reimagined.
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Experience the future of stock management with 3D visualization, 
              predictive analytics, and a seamless glassmorphic interface designed for scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth" className="group px-8 py-4 bg-gradient-to-r from-ocean to-teal text-white rounded-xl font-semibold shadow-lg shadow-ocean/25 hover:shadow-ocean/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-white/5">
               <div>
                 <h3 className="text-2xl font-bold text-white">99.9%</h3>
                 <p className="text-xs text-slate-500 uppercase tracking-wider">Accuracy</p>
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-white">24/7</h3>
                 <p className="text-xs text-slate-500 uppercase tracking-wider">Monitoring</p>
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-white">150+</h3>
                 <p className="text-xs text-slate-500 uppercase tracking-wider">Integrations</p>
               </div>
            </div>
          </div>

          {/* 3D Visual */}
          <div className="relative h-[500px] lg:h-[600px] hidden lg:block animate-float">
            <SplinePlaceholder type="hero" />
            
            {/* Floating Cards simulating 3D depth */}
            <div className="absolute top-20 right-10 glass-panel p-4 rounded-xl animate-float-delayed">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                   <Check className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-slate-400">Order #8832</p>
                   <p className="font-bold text-white">Dispatched</p>
                 </div>
               </div>
            </div>

            <div className="absolute bottom-40 left-0 glass-panel p-4 rounded-xl animate-float">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-ocean/20 flex items-center justify-center text-ocean">
                   <Box className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-slate-400">Low Stock</p>
                   <p className="font-bold text-white">Reorder Auto-Sent</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Built for Modern Commerce</h2>
             <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to manage inventory, orders, and customers in one unified platform.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="md:col-span-2 min-h-[300px] flex flex-col justify-center relative group overflow-hidden">
                 <div className="relative z-10">
                   <div className="w-12 h-12 rounded-xl bg-ocean/20 flex items-center justify-center mb-6 text-ocean group-hover:scale-110 transition-transform">
                     <BarChart3 className="w-6 h-6" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">Real-Time Analytics</h3>
                   <p className="text-slate-400 max-w-md">Monitor your stock levels, sales trends, and warehouse performance with live dashboards that update instantly.</p>
                 </div>
                 <div className="absolute right-[-50px] bottom-[-50px] w-64 h-64 bg-gradient-to-br from-ocean/20 to-teal/20 rounded-full blur-3xl group-hover:opacity-100 transition-opacity"></div>
              </GlassCard>

              <GlassCard className="min-h-[300px] flex flex-col justify-center group relative overflow-hidden">
                 <div className="relative z-10">
                   <div className="w-12 h-12 rounded-xl bg-teal/20 flex items-center justify-center mb-6 text-teal group-hover:scale-110 transition-transform">
                     <Shield className="w-6 h-6" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">Secure Cloud</h3>
                   <p className="text-slate-400">Enterprise-grade encryption and daily backups ensuring your data is always safe.</p>
                 </div>
              </GlassCard>

              <GlassCard className="min-h-[300px] flex flex-col justify-center group relative overflow-hidden">
                 <div className="relative z-10">
                   <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform">
                     <Zap className="w-6 h-6" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">Automation</h3>
                   <p className="text-slate-400">Set up triggers for low stock alerts, automatic reordering, and reporting.</p>
                 </div>
              </GlassCard>

              <GlassCard className="md:col-span-2 min-h-[300px] flex flex-col justify-center group relative overflow-hidden">
                 <div className="relative z-10">
                   <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-6 text-rose-400 group-hover:scale-110 transition-transform">
                     <Globe className="w-6 h-6" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">Global Warehouse Management</h3>
                   <p className="text-slate-400 max-w-md">Manage multiple locations from a single dashboard with zone-based tracking and transfer capabilities.</p>
                 </div>
                 <div className="absolute right-[-50px] top-[-50px] w-64 h-64 bg-gradient-to-br from-rose-500/20 to-amber-500/20 rounded-full blur-3xl group-hover:opacity-100 transition-opacity"></div>
              </GlassCard>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 pt-16 pb-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
             <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-ocean to-teal flex items-center justify-center font-bold text-white text-xs">SM</div>
                  <span className="font-bold text-white">StockMaster</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Empowering businesses with next-generation inventory solutions.
                </p>
             </div>
             <div>
               <h4 className="font-bold text-white mb-4">Product</h4>
               <ul className="space-y-2 text-sm text-slate-400">
                 <li><a href="#" className="hover:text-ocean transition-colors">Features</a></li>
                 <li><a href="#" className="hover:text-ocean transition-colors">Pricing</a></li>
                 <li><a href="#" className="hover:text-ocean transition-colors">API</a></li>
                 <li><a href="#" className="hover:text-ocean transition-colors">Integrations</a></li>
               </ul>
             </div>
             <div>
               <h4 className="font-bold text-white mb-4">Company</h4>
               <ul className="space-y-2 text-sm text-slate-400">
                 <li><a href="#" className="hover:text-ocean transition-colors">About Us</a></li>
                 <li><a href="#" className="hover:text-ocean transition-colors">Careers</a></li>
                 <li><a href="#" className="hover:text-ocean transition-colors">Blog</a></li>
                 <li><a href="#" className="hover:text-ocean transition-colors">Contact</a></li>
               </ul>
             </div>
             <div>
               <h4 className="font-bold text-white mb-4">Legal</h4>
               <ul className="space-y-2 text-sm text-slate-400">
                 <li><a href="#" className="hover:text-ocean transition-colors">Privacy Policy</a></li>
                 <li><a href="#" className="hover:text-ocean transition-colors">Terms of Service</a></li>
                 <li><a href="#" className="hover:text-ocean transition-colors">Security</a></li>
               </ul>
             </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2024 StockMaster Inc. All rights reserved.</p>
            <div className="flex gap-6">
               <a href="#" className="text-slate-500 hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>
               <a href="#" className="text-slate-500 hover:text-white transition-colors"><Layers className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;