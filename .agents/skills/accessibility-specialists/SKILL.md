---
name: accessibility-specialists
description: Open-source WCAG 2.1 AA ruleset for screen reader markup, high contrast focus rings, ARIA roles, and keyboard navigation.
---

# Accessibility (a11y) & WCAG Compliance Standards

## Guidelines
1. **Keyboard Focus States**: Every clickable element (`button`, `a`, `input`, `select`) must feature high-visibility focus indicators: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`.
2. **Accessible Contrast Ratios**: Ensure minimum 4.5:1 text-to-background contrast ratio across all text elements.
3. **Semantic HTML & ARIA**: Use proper `<main>`, `<nav>`, `<aside>`, `<header>`, `role="dialog"`, `aria-label`, and `aria-expanded` tags.
4. **Touch Target Size**: Minimum 44px x 44px interactive target dimensions on mobile layouts.
