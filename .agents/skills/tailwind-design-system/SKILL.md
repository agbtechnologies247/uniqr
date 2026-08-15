---
name: tailwind-design-system
description: Systematic utility-first ruleset for clean, maintainable Tailwind CSS configuration, component classes, and responsive tokens.
---

# Tailwind CSS Systematic Design Rules

## Guidelines
1. **Utility Design Tokens**: Extend `tailwind.config.js` with semantic color keys (`cyan-neon`, `violet-cyber`, `obsidian`, `emerald-glow`) and border radius presets (`rounded-card`, `rounded-button`).
2. **Glassmorphism Utilities**: Leverage `backdrop-blur-xl`, `bg-slate-950/80`, and `border-white/10` for layered depth.
3. **Responsive Consistency**: Enforce mobile-first grid layouts (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
4. **Interactive States**: Always define `:hover`, `:focus-visible`, and `:active` styling on interactive controls.
