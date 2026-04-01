# Design System Strategy: The Editorial Architect



## 1. Overview & Creative North Star

The "Creative North Star" for this design system is **The Digital Curator**.



In an era of cluttered SaaS dashboards, this system moves in the opposite direction: toward the quiet authority of a high-end architectural journal. We are not building a "database"; we are designing a career-defining operating system. The aesthetic must feel intentional, structured, and profoundly calm.



To break the "standard SaaS" look, we employ **Intentional Asymmetry**. Rather than a rigid, centered grid, we use wide margins and staggered content blocks to create a sense of editorial pacing. Large-scale typography acts as a structural element, not just a label, guiding the eye through a narrative of professional growth.



---



## 2. Colors: Tonal Depth & Atmospheric Layers

This system rejects the "flat" dark mode in favor of a warm, atmospheric palette that mimics natural materials—charcoal, parchment, and amber.



### The "No-Line" Rule

**Explicit Instruction:** Do not use 1px solid borders to define sections. A premium interface feels seamless. To separate content, use background shifts:

* Place a `surface_container_low` section directly on a `surface` background.

* The transition in tone provides the boundary. Lines create visual noise; tonal shifts create "zones."



### Surface Hierarchy & Nesting

Treat the UI as a physical stack of fine paper.

* **Base Layer (`surface` / `#161311`):** The foundation. Everything rests here.

* **Secondary Layer (`surface_container` / `#221f1d`):** Use for large sidebar or navigation regions.

* **Interactive Layer (`surface_container_high` / `#2d2927`):** Use for cards, data blocks, or modular units.

* **Elevated Layer (`surface_container_highest` / `#383431`):** Use for active states or floating elements.



### The "Glass & Gradient" Rule

To add "soul" to the professional tool:

* **Glassmorphism:** For floating modals or navigation bars, use `surface_container` with a 70% opacity and a `24px` backdrop-blur. This allows the warm tones of the background to bleed through, softening the interface.

* **The Signature Glow:** Main CTAs should not be flat. Use a subtle linear gradient from `primary` (#ffb86c) to `primary_container` (#c8863a) at a 135-degree angle. This gives buttons a "lit from within" quality.



---



## 3. Typography: The Editorial Voice

We use a high-contrast pairing to balance heritage with modern utility.



* **The Hero (Newsreader):** Use for `display` and `headline` levels. It conveys wisdom, history, and status. It should be used sparingly—for page titles and major milestones—to maintain its impact.

* **The Engine (Manrope):** Use for `title`, `body`, and `label` levels. Its clean, geometric nature ensures that dense career data remains legible and objective.



**Design Note:** Use `display-lg` (3.5rem) for high-impact numbers (e.g., "98% Match") to make data feel like a headline achievement.



---



## 4. Elevation & Depth: Tonal Layering

Traditional shadows and borders are replaced by light and stacking.



* **The Layering Principle:** Depth is achieved by placing a darker container inside a lighter one (or vice versa). Example: Place a `surface_container_lowest` (#100e0c) input field inside a `surface_container_high` (#2d2927) card. The "inset" feel creates natural focus.

* **Ambient Shadows:** If an element must "float" (like a dropdown), use a shadow with a `32px` blur, 0% spread, and an opacity of `8%`. The shadow color must be `on_surface` (#e9e1dd), not black, to simulate a warm glow reflecting off the surface below.

* **The "Ghost Border":** If accessibility requires a boundary, use `outline_variant` (#524438) at 15% opacity. It should be barely perceptible—felt rather than seen.



---



## 5. Components: Refined Utility



### Buttons & Chips

* **Primary Button:** Gradient fill (`primary` to `primary_container`), `label-md` Manrope (All-caps, 0.05em tracking). Roundness: `xl` (1.5rem).

* **Secondary Button:** Ghost style. No background, `outline_variant` border at 20% opacity.

* **Chips:** Use `secondary_container` with `label-sm` text. These should feel like small "tags" in a physical archive.



### Input Fields

* **Style:** No bottom line. Use a `surface_container_low` fill with a `sm` (0.25rem) roundness.

* **Active State:** Transition the border to a 1px `primary` stroke and add a soft `primary` outer glow (4px blur).



### Cards & Lists

* **The No-Divider Rule:** Never use horizontal lines to separate list items. Use `8px` of vertical whitespace (`spacing-1.5`) or alternating background tints between `surface_container_low` and `surface_container`.

* **Career Score Cards:** Use `tertiary` (#93d2d1) for "High Fit" scores. Apply a subtle 5% opacity `tertiary` tint to the entire card background to categorize it visually without reading the text.



### Professional Timeline (Custom Component)

* A vertical track using `outline_variant` (1px width). Nodes should be `primary_fixed_dim` (#ffb86c) dots. Use `headline-sm` Newsreader for dates to give the user's history an editorial, "biography" feel.



---



## 6. Do’s and Don’ts



### Do

* **Use Whitespace as a Luxury:** Give elements more room than you think they need. Spacing `16` (5.5rem) between major sections is encouraged.

* **Mix Weights:** Pair a `headline-lg` (Newsreader Regular) with a `label-sm` (Manrope Bold) for a sophisticated hierarchy.

* **Embrace the "Near-Black":** Trust the `#14110F` background. It reduces eye strain and makes the `primary` amber accents feel like a high-end watch face.



### Don't

* **Don't Use Pure Black or Pure White:** It breaks the "Heritage" atmosphere. Always stick to the warm off-whites and charcoal tones provided.

* **Don't Use Default Shadows:** Standard "Drop Shadows" will make the UI look cheap. Stick to tonal layering.

* **Don't Over-Animate:** Transitions should be slow and "weighted" (e.g., 300ms ease-out). No bouncy or "pop" animations; the system should feel steady and reliable.