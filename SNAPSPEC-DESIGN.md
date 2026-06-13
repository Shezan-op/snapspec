---
version: alpha
name: SnapSpec-Production-Design-System
description: A strict, utility-first interface focused on screenshot-to-spec conversion. The UI behaves more like a developer tool than a SaaS marketing website. Every visual decision prioritizes clarity, trust, speed, and output generation over branding theatrics.
---

# IMPORTANT IMPLEMENTATION RULE

DO NOT recreate or redesign the SnapSpec logo.

For all logo and wordmark usage:

- Load icon from `/Branding`
- Load wordmark from `/Branding`
- Use the official assets exactly as provided
- No recreation
- No reinterpretation
- No icon exploration
- No alternate lockups
- No generated SVG replacements

The Branding folder is the single source of truth.

Only build the UI around those assets.

---

# Overview

This interface is not a marketing homepage.

It is a utility surface.

The entire experience communicates:

"Upload screenshot. Generate Design.md. Build faster."

The page removes nearly all traditional SaaS distractions.

No feature grids.
No testimonials.
No gradients.
No visual noise.
No fake AI aesthetics.

The product itself is the hero.

The homepage acts like a focused tool launcher rather than a sales page.

The design language combines:

- Linear discipline
- Vercel restraint
- Notion simplicity
- Terminal-like honesty

Everything serves a single workflow:

Screenshot → Design.md → Implementation

---

# Core Product Philosophy

The UI must feel:

- Functional
- Calm
- Technical
- Precise
- Developer-oriented
- Private
- Trustworthy

It must NOT feel:

- Startup-y
- Futuristic
- Playful
- Corporate
- Enterprise-heavy
- Animated for attention

The interface should disappear behind the task.

---

# Key Characteristics

- Black canvas with white typography
- Single-column hero
- Extremely high visual hierarchy
- Large centered headline
- Minimal navigation
- Product workflow shown visually
- Thin borders everywhere
- Almost zero decorative elements
- No card stacking
- No floating UI
- No shadows
- No gradients
- No glow
- Large whitespace rhythm
- Utility-first structure
- Screenshot upload as primary interaction

---

# Colors

## Background

Primary Background

```txt
#000000
```

Must be pure black.

No dark gray replacements.

No tinted backgrounds.

---

## Primary Surface

```txt
#000000
```

Surface blends into page.

Sections separated through spacing.

Not color.

---

## Borders

Likely:

```txt
#242424
#2A2A2A
#303030
```

Use only one border color globally.

Preferred:

```txt
#2A2A2A
```

Border width:

```txt
1px
```

---

## Text

Primary:

```txt
#FFFFFF
```

Secondary:

```txt
#B5B5B5
```

Muted:

```txt
#8A8A8A
```

Disabled:

```txt
#666666
```

---

## Buttons

Primary:

Background:
#FFFFFF

Text:
#000000

---

Secondary:

Transparent

Border:
#2A2A2A

Text:
#FFFFFF

---

## Semantic Colors

Not visible.

Do not introduce.

Only use if product states require them.

---

# Typography

## Font Family

Preferred:

```txt
Inter
```

Fallback:

```txt
system-ui
sans-serif
```

No display fonts.

No geometric branding fonts.

No experimental fonts.

---

## Headline

Style:

```txt
64px–80px
```

Weight:

```txt
700
```

Tracking:

```txt
-0.04em
```

Line Height:

```txt
0.95–1.0
```

---

## Section Headings

```txt
32px–40px
600
```

---

## Body

```txt
16px
400
```

---

## Small Labels

```txt
12px
500
```

Uppercase
Wide tracking

Used sparingly.

---

## Code Blocks

Use:

```txt
JetBrains Mono
```

or

```txt
SF Mono
```

Used only for generated Design.md previews.

---

# Layout

## Container

Maximum Width:

```txt
1200px
```

Preferred:

```txt
1120px
```

Centered.

---

## Hero Layout

Single centered column.

Order:

1. Logo/Nav
2. Eyebrow
3. Headline
4. Supporting text
5. Upload interface

Nothing else.

---

## Vertical Rhythm

Major Sections:

```txt
120px–160px
```

Minor Groups:

```txt
32px–48px
```

Internal Components:

```txt
16px–24px
```

---

## Grid Usage

Only where required.

Workflow section:

```txt
3 columns
```

Desktop

---

Comparison section:

```txt
2 columns
```

Desktop

---

Footer:

Simple horizontal layout.

---

# Shapes

## Geometry Philosophy

Rectangular.

Precise.

No soft consumer-product curves.

---

## Radius Scale

Buttons:

```txt
6px
```

Upload Container:

```txt
8px
```

Cards:

```txt
8px
```

Inputs:

```txt
6px
```

Never exceed:

```txt
10px
```

---

# Elevation & Depth

## Shadows

None.

```txt
box-shadow: none;
```

---

## Glows

Forbidden.

---

## Background Blur

Forbidden.

---

## Glassmorphism

Forbidden.

---

## Layering

Created through:

- Borders
- Contrast
- Spacing

Only.

---

# Components

---

## Nav Bar

Purpose:

Navigation only.

Height:

```txt
72px
```

Structure:

Left:
Logo + Wordmark from Branding folder

Right:
- Docs
- GitHub
- Pricing
- Open App

Open App = Primary CTA

No sticky effects required.

---

## Hero Eyebrow

Uppercase.

Small.

Muted.

Centered.

Example:

```txt
TURN INSPIRATION INTO BLUEPRINTS
```

---

## Hero Headline

Large.

Maximum 2 lines.

Centered.

Must dominate viewport.

---

## Hero Supporting Copy

Maximum:

4 lines

Never exceed:

80 characters per line.

---

## Upload Container

This is the primary component.

Width:

```txt
700px–900px
```

Centered.

Contains:

- Upload icon
- Upload instruction
- Supported formats
- Screenshot preview
- Generate button

---

## Screenshot Preview

Large.

Centered.

Actual uploaded image.

No browser chrome decoration.

No fake mockups.

---

## Generate Button

Full width.

White.

Black text.

Strong contrast.

---

## Workflow Section

Three columns.

Structure:

01 Upload Screenshot

02 Generate Design.md

03 Build Faster

Large spacing.

Thin dividers.

---

## Before / After Comparison

Two-column grid.

Left:

Screenshot

Right:

Generated Design.md

Equal visual weight.

---

## Trust Row

Three items.

Examples:

- Privacy First
- No Database
- Bring Your Own API Key

Centered.

Equal spacing.

---

## Quote Section

Single centered statement.

Large typography.

No testimonials.

No avatars.

No logos.

Only text.

---

## Footer

Minimal.

Left:

Links

Right:

Copyright

No newsletter.

No social blocks.

---

# Interaction Behavior

## Hover States

Links:

Opacity reduction only.

```css
opacity: 0.7;
```

---

Buttons:

Background transition only.

No scale.

No glow.

No bounce.

---

## Upload Area

Border highlight on drag.

Nothing else.

---

## Loading State

Simple.

Use:

```txt
Analyzing screenshot...
Generating Design.md...
```

No animated illustrations.

---

# Responsive Behavior

## Tablet

Convert:

3 columns → stacked

Comparison section → stacked

Upload container width reduced

---

## Mobile

Single column only.

Headline:

40px–52px

Navigation:

Collapse to menu.

Workflow:

Vertical.

Footer:

Stacked.

---

# Motion

Motion should feel almost absent.

Use:

```txt
150ms–200ms
```

Maximum.

Allowed:

- opacity
- border color
- background color

Forbidden:

- spring animations
- parallax
- floating effects
- reveal chains
- scroll theatrics

---

# Strict Do / Don't

## DO

- Keep pure black background
- Keep white primary typography
- Keep large whitespace
- Keep thin borders
- Keep utility-first structure
- Keep upload flow dominant
- Keep Design.md preview visible
- Use Branding folder assets only

---

## DON'T

- Add gradients
- Add glow
- Add glassmorphism
- Add colorful accents
- Add floating cards
- Add AI-generated illustrations
- Add dashboard screenshots everywhere
- Add feature bloat
- Add testimonials
- Add animated backgrounds
- Add noisy marketing sections
- Add enterprise-style complexity

---

# Iteration Guide

If improving the design:

Priority #1:
Preserve clarity.

Priority #2:
Preserve upload workflow prominence.

Priority #3:
Preserve whitespace.

Priority #4:
Preserve typography hierarchy.

Priority #5:
Preserve monochrome discipline.

If a new section weakens the core flow:

Remove it.

The homepage should always answer:

1. What does this do?
2. How does it work?
3. Why should I trust it?

Within 10 seconds.

---

# Known Gaps

Cannot be confirmed from screenshot:

- Exact font family
- Exact spacing tokens
- Exact border color
- Exact responsive breakpoints
- Exact animation timings
- Focus state styling
- Error state styling
- Upload progress styling
- Authentication flow
- Dashboard UI
- Generated Design.md viewer behavior

These values should remain implementation decisions while preserving the visual language defined above.