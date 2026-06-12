import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'light', className = '', size = 'md' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-slate-900' : 'text-white';
  const sizeClasses = {
    sm: { wrapper: 'gap-0.5', top: 'text-[8px]', eat: 'text-lg', right: 'text-lg', svg: 'w-6 h-6', foods: 'text-[9px] tracking-[0.35em]' },
    md: { wrapper: 'gap-1', top: 'text-[10px]', eat: 'text-2xl', right: 'text-2xl', svg: 'w-8 h-8', foods: 'text-xs tracking-[0.45em] -mt-0.5' },
    lg: { wrapper: 'gap-1.5', top: 'text-xs', eat: 'text-4xl', right: 'text-4xl', svg: 'w-12 h-12', foods: 'text-sm tracking-[0.5em] -mt-1' },
  };

  const c = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center select-none font-bold inline-flex ${className}`} id="eatright-logo">
      <div className={`flex items-center ${c.wrapper}`}>
        <span className={`font-black tracking-widest text-red-600 leading-none self-start mb-1 uppercase ${c.top}`}>
          ERF
        </span>
        <div className="flex items-center">
          <span className={`font-serif font-bold leading-none ${textColor}`}>
            EAT
          </span>
          {/* Branded dual-leaf stem SVG representing healthy options & organic nature */}
          <svg className={`${c.svg} -mx-1 text-green-600 inline-block align-middle fill-current`} viewBox="0 0 100 100" id="logo-stem-svg">
            <path d="M45,85 C25,65 20,40 50,20 C50,20 55,10 65,15 C75,20 70,35 55,42 C50,45 42,52 45,85 Z" className="text-green-600 fill-current" />
            <path d="M35,45 C20,30 25,15 45,25 C45,25 48,27 45,35 C42,43 38,45 35,45 Z" className="text-emerald-500 fill-current" />
            <circle cx="45" cy="85" r="5" className="text-green-700 fill-current" />
          </svg>
          <span className={`font-serif font-bold tracking-wider leading-none ${textColor}`}>
            RIGHT
          </span>
        </div>
      </div>
      <div className={`font-black text-red-600 leading-none uppercase ${c.foods}`}>
        FOODS
      </div>
    </div>
  );
}
