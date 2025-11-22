"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ArrowRightLeft, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  History,
  FileText
} from 'lucide-react';
import NotificationDropdown from './ui/NotificationDropdown';
import { getCurrentUser, AuthUser } from '@/api/auth';

interface NavbarProps {
  isLanding: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLanding, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch current user for navbar display
    getCurrentUser()
      .then(setUser)
      .catch((err) => {
        console.error('Failed to load current user for navbar', err);
      });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Operations', path: '/operations', icon: ArrowRightLeft },
    { name: 'Move History', path: '/move-history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => pathname === path;

  if (isLanding) return null;

  return (
    <>
      <nav 
        className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          left-1/2 -translate-x-1/2 rounded-full border border-white/10 flex items-center
          ${isScrolled 
            ? 'top-4 h-14 w-[95%] md:w-[85%] max-w-[1200px] bg-[#0A0E1A]/80 backdrop-blur-2xl shadow-2xl shadow-black/50' 
            : 'top-6 h-16 w-[95%] md:w-[92%] max-w-[1400px] bg-[#131824]/70 backdrop-blur-xl shadow-xl'}`}
      >
        <div className="w-full px-4 md:px-6 flex items-center justify-between h-full relative">
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean to-teal flex items-center justify-center text-white font-bold shadow-lg shadow-ocean/20 group-hover:shadow-ocean/40 transition-all duration-300 text-xs">
              SM
            </div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
              StockMaster
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 h-full">
            {navLinks.map((link) => (
              <div 
                key={link.path} 
                className="relative h-full flex items-center"
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <Link
                  href={link.path}
                  className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all rounded-full mx-0.5
                    ${isActive(link.path) ? 'text-white bg-white/10 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <link.icon className={`w-4 h-4 ${isActive(link.path) ? 'text-ocean' : ''}`} />
                  {link.name}
                  {(link as any).dropdown && <ChevronDown className="w-3 h-3 opacity-50" />}
                </Link>

                {/* Dropdown Menu */}
                {(link as any).dropdown && hoveredLink === link.name && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#131824] border border-white/10 rounded-2xl shadow-xl z-40 py-1 animate-fade-in-up overflow-hidden">
                    {(link as any).dropdown.map((item: any) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
                          ${isActive(item.path) ? 'text-ocean bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Search */}
            <div className="hidden lg:flex items-center relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 group-focus-within:text-ocean transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm w-32 focus:w-48 transition-all duration-300 focus:outline-none focus:border-ocean/50 focus:bg-white/10 placeholder:text-slate-500 text-white"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 ${isNotifOpen ? 'bg-white/10 text-white' : 'text-slate-300'}`}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 border border-deep"></span>
              </button>
              <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>

            <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-ocean to-teal hover:opacity-90 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-ocean/20">
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">Add</span>
            </button>

            {/* User Avatar & Menu */}
            <div className="relative">
              <div 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-white/10"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                  <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover opacity-80" />
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
              </div>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-3 w-56 bg-[#131824] border border-white/10 rounded-2xl shadow-2xl z-40 py-2 animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                      <p className="text-sm font-medium text-white">{user?.name || user?.fullName || 'User'}</p>
                      <p className="text-xs text-slate-500">{user?.email || ''}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 mx-2 rounded-lg transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 mx-2 rounded-lg transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <div className="border-t border-white/5 mt-2 pt-2">
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 text-left mx-2 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-400 hover:text-white bg-white/5 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (Floating Card below Navbar) */}
        {isMobileMenuOpen && (
          <div className="absolute top-full mt-2 left-0 w-full bg-[#131824]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex flex-col gap-2 shadow-2xl z-50 animate-fade-in-up origin-top">
            {navLinks.map((link) => (
              <React.Fragment key={link.path}>
                <Link
                  href={link.path}
                  onClick={() => !(link as any).dropdown && setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive(link.path) ? 'bg-white/10 text-white border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <link.icon className={`w-5 h-5 ${isActive(link.path) ? 'text-ocean' : ''}`} />
                  {link.name}
                </Link>
                {/* Mobile Dropdown Items */}
                {(link as any).dropdown && (
                  <div className="pl-4 space-y-1 border-l border-white/5 ml-4">
                    {(link as any).dropdown.map((item: any) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all
                          ${isActive(item.path) ? 'text-ocean' : 'text-slate-500 hover:text-white'}`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            <div className="h-[1px] bg-white/10 my-1"></div>
            <Link 
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <User className="w-5 h-5" /> Profile
            </Link>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                if(onLogout) onLogout();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
