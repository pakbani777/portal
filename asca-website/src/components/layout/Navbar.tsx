"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, UserCircle, Sun, Moon, MessageCircle } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar({ 
  logoUrl,
  menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Tentang", href: "/#tentang" },
    { label: "Lembaga", href: "/#lembaga" },
    { label: "Kontak", href: "/#kontak" }
  ],
  socialLinks
}: { 
  logoUrl?: string;
  menuItems?: { label: string; href: string }[];
  socialLinks?: {
    ig?: string;
    fb?: string;
    youtube?: string;
    tiktok?: string;
    wa?: string;
  };
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to toggle theme based on currently resolved theme
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled ? "py-2" : "py-4 sm:py-6"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between rounded-full border px-6 transition-all duration-300 ${
              isScrolled
                ? "bg-white/90 border-blue-100 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.1)] dark:bg-slate-900/80 dark:border-slate-800/50 dark:shadow-lg py-3 backdrop-blur-md"
                : "bg-white/95 border-blue-50 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.05)] dark:bg-slate-900/90 dark:border-slate-800/50 dark:shadow-xl py-4 backdrop-blur-sm"
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-50">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo ASCA" className="h-10 w-auto object-contain" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 dark:to-indigo-800 text-white shadow-md shadow-blue-500/20">
                  <span className="text-lg font-black tracking-tighter">A</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none text-blue-950 dark:text-white">ASCA</span>
                <span className="text-[10px] font-bold text-orange-500 tracking-wider">FOUNDATION</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-blue-50/80 dark:bg-slate-800/50 p-1 rounded-full border border-blue-100 dark:border-slate-700/50">
              {menuItems.map((item, i) => {
                if (item.label.toLowerCase() === "lembaga") {
                  return (
                    <div 
                      key={i}
                      className="relative"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <button className="flex items-center gap-1 px-5 py-2 text-sm font-bold rounded-full text-blue-900 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 transition-all">
                        {item.label} <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                      </button>
                      
                      <div 
                        className={`absolute left-1/2 mt-2 w-56 -translate-x-1/2 transform rounded-2xl border border-blue-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 p-2 shadow-2xl shadow-blue-900/10 dark:shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                          dropdownOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible"
                        }`}
                      >
                        <Link href="/rumah-quran" className="group flex flex-col rounded-xl px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                          <span className="font-bold text-blue-800 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300">Rumah Qur'an</span>
                          <span className="text-xs font-medium text-blue-600/70 dark:text-slate-400">Tahsin & Tahfidz</span>
                        </Link>
                        <Link href="/sd-quran" className="group flex flex-col rounded-xl px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors mt-1">
                          <span className="font-bold text-orange-600 dark:text-orange-400 group-hover:text-orange-500 dark:group-hover:text-orange-300">SD Qur'an</span>
                          <span className="text-xs font-medium text-orange-600/70 dark:text-slate-400">Pendidikan Dasar Terpadu</span>
                        </Link>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <Link key={i} href={item.href} className="px-5 py-2 text-sm font-bold rounded-full text-blue-900 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 transition-all">
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3 z-50">
              {/* Social Icons */}
              {socialLinks && (
                <div className="flex items-center gap-1 mr-2 border-r border-slate-200 dark:border-slate-700 pr-3">
                  {socialLinks.ig && (
                    <a href={socialLinks.ig} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-slate-800 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                  )}
                  {socialLinks.fb && (
                    <a href={socialLinks.fb} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-800 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-800 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                    </a>
                  )}
                  {socialLinks.tiktok && (
                    <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                    </a>
                  )}
                </div>
              )}

              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Toggle Theme"
                >
                  {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}
              
              {socialLinks?.wa && (
                <a 
                  href={socialLinks.wa}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-2 rounded-full bg-emerald-500 dark:bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Hubungi
                </a>
              )}

              <Link 
                href="/admin" 
                className="group flex items-center gap-2 rounded-full bg-blue-600 dark:bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-orange-500 dark:hover:bg-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              >
                <UserCircle className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
                Login
              </Link>
            </div>

            {/* Mobile Menu Toggle & Theme */}
            <div className="flex md:hidden items-center gap-2 z-50">
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-slate-300 transition-colors hover:bg-blue-100 dark:hover:bg-slate-700"
                >
                  {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}
              <button 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-slate-300 transition-colors hover:bg-blue-100 dark:hover:bg-slate-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[360px] z-50 bg-white dark:bg-[#0b1121] shadow-2xl transition-transform duration-500 ease-[0.22,1,0.36,1] md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header area in mobile menu */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-md">
                <span className="text-sm font-black tracking-tighter">A</span>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">ASCA Menu</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 px-6 py-8 flex flex-col gap-2">
            {menuItems.map((item, i) => {
              if (item.label.toLowerCase() === "lembaga") {
                return (
                  <div key={i} className="py-2">
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 block pl-4">Program Kami</span>
                    <div className="flex flex-col gap-2">
                      <Link 
                        href="/rumah-quran" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="group flex flex-col rounded-2xl px-5 py-4 bg-orange-50/50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 border border-orange-100/50 dark:border-orange-500/10 transition-colors"
                      >
                        <span className="font-bold text-orange-600 dark:text-orange-400">Rumah Qur'an</span>
                        <span className="text-xs font-medium text-orange-600/70 dark:text-orange-400/70 mt-1">Tahsin & Tahfidz</span>
                      </Link>
                      <Link 
                        href="/sd-quran" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="group flex flex-col rounded-2xl px-5 py-4 bg-blue-50/50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-100/50 dark:border-blue-500/10 transition-colors"
                      >
                        <span className="font-bold text-blue-600 dark:text-blue-400">SD Qur'an</span>
                        <span className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mt-1">Pendidikan Dasar Terpadu</span>
                      </Link>
                    </div>
                  </div>
                );
              }
              return (
                <Link 
                  key={i} 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center px-4 py-4 rounded-2xl text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-[#0a0f1c]/50 mt-auto flex flex-col gap-4">
            {socialLinks?.wa && (
              <a 
                href={socialLinks.wa}
                target="_blank"
                rel="noopener noreferrer" 
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="h-5 w-5" />
                Hubungi via WhatsApp
              </a>
            )}
            
            {/* Social Icons for Mobile */}
            {socialLinks && (
              <div className="flex items-center justify-center gap-4 py-2">
                {socialLinks.ig && (
                  <a href={socialLinks.ig} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-500 hover:text-pink-600 shadow-sm transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                )}
                {socialLinks.fb && (
                  <a href={socialLinks.fb} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-500 hover:text-blue-600 shadow-sm transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-500 hover:text-red-600 shadow-sm transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  </a>
                )}
              </div>
            )}
            
            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 px-5 py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] mt-2"
            >
              <UserCircle className="h-5 w-5 opacity-80" />
              Login Admin
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
