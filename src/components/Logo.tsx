import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'logo-1' | 'logo-2';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'logo-1', className = '', size = 'md' }: LogoProps) {
  // Map standard old 'light' / 'dark' to logo-1 formats, or use logo-2 directly
  const isDarkCtx = variant === 'dark';
  const isLogo2 = variant === 'logo-2';

  const sizeClasses = {
    sm: {
      wrapper: 'gap-0.5',
      top: 'text-[8px]',
      eat: 'text-lg',
      svg: 'w-6 h-6',
      crest: 'w-10 h-10',
      foods: 'text-[9px] tracking-[0.35em]'
    },
    md: {
      wrapper: 'gap-1',
      top: 'text-[10px]',
      eat: 'text-2xl',
      svg: 'w-8 h-8',
      crest: 'w-16 h-16',
      foods: 'text-xs tracking-[0.45em] -mt-0.5'
    },
    lg: {
      wrapper: 'gap-1.5',
      top: 'text-xs',
      eat: 'text-4xl',
      svg: 'w-12 h-12',
      crest: 'w-24 h-24',
      foods: 'text-sm tracking-[0.5em] -mt-1'
    },
  };

  const c = sizeClasses[size];
  const textClr = isDarkCtx ? 'text-white' : 'text-slate-900';

  if (isLogo2) {
    // Logo-2: Round organic green badge representing certified EatRight wellness system and climate standards
    return (
      <div className={`flex items-center gap-3 select-none ${className}`} id="eatright-organic-seal">
        <svg className={`${c.crest} text-emerald-600 fill-none`} viewBox="0 0 100 100" id="organic-seal-crest">
          {/* Circular badge background */}
          <circle cx="50" cy="50" r="45" className="fill-green-950/20 stroke-emerald-600 stroke-2" />
          <circle cx="50" cy="50" r="40" className="stroke-emerald-500/30 stroke-1 stroke-dasharray-[2,2]" />
          
          {/* Inner decorative stellar star */}
          <path d="M50,15 L53,35 L73,38 L56,48 L62,68 L50,55 L38,68 L44,48 L27,38 L47,35 Z" className="fill-emerald-500/20 stroke-emerald-400 stroke-1" />
          
          {/* Dual leaf icons inside the seal */}
          <path d="M42,62 C34,50 35,35 50,30 C50,30 53,24 58,28 C63,32 59,42 51,46 C48,48 44,52 42,62 Z" className="fill-green-500" />
          <path d="M38,45 C28,34 32,24 45,30 C45,30 47,31 46,36 C44,41 41,42 38,45 Z" className="fill-emerald-400" />
          
          {/* Star at center core */}
          <circle cx="50" cy="50" r="3" className="fill-amber-400" />
        </svg>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider font-mono">EatRight standard</span>
          <span className="text-sm font-black text-white font-serif tracking-tight leading-none uppercase mt-0.5">Organic Certified</span>
          <span className="text-[9px] text-slate-400 mt-1 font-semibold leading-none">ECAI Eco-Approved System</span>
        </div>
      </div>
    );
  }

  // Logo-1: Primary corporate design with the red ERF tag and dual-leaf stem SVG
  return (
    <div className={`flex flex-col items-center select-none font-bold inline-flex ${className}`} id="eatright-logo-1">
      <div className={`flex items-center ${c.wrapper}`}>
        <span className="font-black tracking-widest text-red-600 leading-none self-start mb-1 uppercase text-[10px]">
          ERF
        </span>
        <div className="flex items-center">
          <span className={`font-serif font-black leading-none ${textClr}`}>
            EAT
          </span>
          {/* Branded dual-leaf stem SVG representing healthy options & organic nature */}
          <svg className={`${c.svg} -mx-1 text-green-600 inline-block align-middle fill-current`} viewBox="0 0 100 100" id="logo-stem-svg">
            <path d="M45,85 C25,65 20,40 50,20 C50,20 55,10 65,15 C75,20 70,35 55,42 C50,45 42,52 45,85 Z" className="text-green-600 fill-current" />
            <path d="M35,45 C20,30 25,15 45,25 C45,25 48,27 45,35 C42,43 38,45 35,45 Z" className="text-emerald-500 fill-current" />
            <circle cx="45" cy="85" r="5" className="text-green-700 fill-current" />
          </svg>
          <span className={`font-serif font-black tracking-wider leading-none ${textClr}`}>
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
