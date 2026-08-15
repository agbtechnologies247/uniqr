---
name: design-token-sync
description: Design token synchronization pipelines connecting Tokens Studio (Figma Tokens) and Style Dictionary to code repositories.
---

# Design Token Synchronization (Tokens Studio & Style Dictionary)

## Guidelines
1. **Single Source of Truth**: Map design variables directly to CSS custom properties & Tailwind theme config (`#1D4533`, `#F7EAE0`, `#F9D2BA`, `#5E3122`).
2. **Multi-Format Export**: Standardize design token JSON outputs across web (CSS/Tailwind), iOS (Swift UI), and Android.
3. **Automated Pipeline**: Sync color palette changes automatically into code to prevent manual styling discrepancies.
