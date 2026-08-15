---
name: storybook-component-workspace
description: Storybook isolated component building, visual testing, and documentation workspace patterns for reducing context hopping.
---

# Storybook & Component Workspace Integration

## Core Guidelines
1. **Isolated Component Design**: Build UI components in isolation from business logic to eliminate context-switching.
2. **Interactive Controls & Args**: Document component states (default, hover, focus, disabled, loading) with interactive props.
3. **Snapshot & Visual Testing**: Test edge cases (long text overflow, mobile viewports, high contrast mode) before integrating into `/app`.
