'use client';

import { useActionState } from 'react';
import { login } from '../actions';
import { KeyRound, User, Lock, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

const initialState = {
  error: '',
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-600/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/20 dark:bg-orange-600/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse animation-delay-2000"></div>

      {/* Back to Home button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 transition-all hover:shadow-md">
          <Home className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-800/50 p-8 sm:p-10 relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-10">
            {/* Logo Wrapper */}
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-orange-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
              <div className="relative h-20 w-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white border border-white/20 shadow-xl overflow-hidden">
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-tl-3xl opacity-90 rotate-12"></div>
                <KeyRound className="h-8 w-8 relative z-10 drop-shadow-md" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 dark:from-white dark:via-blue-200 dark:to-blue-400 text-center">
              Admin ASCA
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-2 text-center">
              Login untuk mengelola konten website
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-4 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                {state.error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input 
                  name="username" 
                  type="text" 
                  required 
                  className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm placeholder:font-medium placeholder:text-slate-400" 
                  placeholder="Username"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm placeholder:font-medium placeholder:text-slate-400" 
                  placeholder="Password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={pending}
              className="group relative w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center overflow-hidden"
            >
              {/* Button Highlight Effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {pending ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2 relative z-10 text-base">
                  Masuk Sistem <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-center">
            <div className="flex items-center gap-2 z-50 opacity-50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
                <span className="text-[10px] font-black tracking-tighter">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-none text-blue-950 dark:text-white">ASCA</span>
                <span className="text-[6px] font-bold text-orange-500 tracking-wider">FOUNDATION</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
