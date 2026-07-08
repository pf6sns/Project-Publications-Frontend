/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  /*
   * All elements absolutely positioned for pixel-perfect alignment.
   *
   *   Button : 64 × 32 px
   *   Thumb  : 28 × 28 px, inset 2 px from every edge
   *
   *   Light → thumb at left: 2  (x=2..30, center=16)
   *   Dark  → thumb at left: 34 (x=34..62, center=48)
   *
   *   Sun icon  : absolutely centered at (16, 16) — covers thumb in light mode
   *   Moon icon : absolutely centered at (48, 16) — covers thumb in dark mode
   *
   *   translateX = 34 - 2 = 32 px
   */

  const THUMB_SIZE = 28;
  const INSET = 2;
  const ICON_SIZE = 14;

  // Centre of each thumb zone
  const sunCX  = INSET + THUMB_SIZE / 2;          // 16
  const moonCX = INSET + THUMB_SIZE + INSET + THUMB_SIZE / 2;  // 48

  return (
    <button
      onClick={onToggle}
      className="relative shrink-0 select-none cursor-pointer focus:outline-none"
      style={{ width: 64, height: 32, borderRadius: 9999 }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {/* ── Track ── */}
      <span
        className="absolute inset-0 rounded-full border transition-colors duration-300"
        style={{
          background: isDark ? '#1e293b' : '#f1f5f9',
          borderColor: isDark ? '#334155' : '#e2e8f0',
        }}
      />

      {/* ── Sliding thumb ── */}
      <span
        className="absolute rounded-full shadow-md transition-transform duration-500"
        style={{
          top: INSET,
          left: INSET,
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          background: isDark ? '#0f172a' : '#ffffff',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          transform: isDark ? `translateX(${moonCX - sunCX}px)` : 'translateX(0)',
          transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
          zIndex: 1,
        }}
      />

      {/* ── Sun icon — centred in left thumb zone ── */}
      <span
        className="absolute flex items-center justify-center"
        style={{
          top: 0,
          left: sunCX - ICON_SIZE / 2,
          width: ICON_SIZE,
          height: 32,
          zIndex: 2,
        }}
      >
        <Sun
          className={`transition-all duration-500 ease-out ${
            isDark
              ? 'opacity-30 scale-75 rotate-45 text-slate-500'
              : 'opacity-100 scale-100 rotate-0 text-amber-500'
          }`}
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
        />
      </span>

      {/* ── Moon icon — centred in right thumb zone ── */}
      <span
        className="absolute flex items-center justify-center"
        style={{
          top: 0,
          left: moonCX - ICON_SIZE / 2,
          width: ICON_SIZE,
          height: 32,
          zIndex: 2,
        }}
      >
        <Moon
          className={`transition-all duration-500 ease-out ${
            isDark
              ? 'opacity-100 scale-100 rotate-0 text-indigo-400'
              : 'opacity-30 scale-75 -rotate-45 text-slate-400'
          }`}
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
        />
      </span>
    </button>
  );
}
