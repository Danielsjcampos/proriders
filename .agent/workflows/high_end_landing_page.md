---
name: Landing Page Generation (High-End)
description: Create premium, high-converting landing pages with advanced visual effects (scroll animations, glassmorphism, particles) and psychological conversion triggers.
---

# High-End Landing Page Generation Skill

This skill guides the creation of landing pages that blend **cinematic visual effects** with **aggressive conversion psychology**. The reference standard is the "TPR Thiago" project.

## 1. Core Philosophy

A "High-End" landing page must satisfy two opposing goals:
1.  **Wow Factor (Visuals)**: Establish immediate authority and premium positioning through design execution. If it looks expensive, the product is perceived as valuable.
2.  **Conversion (Psychology)**: Use direct response copywriting principles, value stacking, and scarcity to drive action.

## 2. Technology Stack

-   **Framework**: React (Vite or Next.js)
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion (for scroll/layout), Three.js/Canvas (for hero effects)
-   **Icons**: Lucide React
-   **Utils**: `clsx`, `tailwind-merge`

## 3. Visual Guidelines ( The "Premium" Look)

### A. Color Palette
-   **Background**: Deep Black (`#050505`) or extremely dark grey (`#0a0a0a`).
-   **Text**: Pure White (`#ffffff`) for headings, Muted White (`#ffffffcc`) for body.
-   **Accents**:
    -   **Primary**: Neon/Vibrant color (e.g., `#ff1e1e` Red) for urgent actions/brands.
    -   **Luxury**: Metallic Gold (`#f59e0b`) or Silver for premium badges and value highlights.
-   **Gradients**: Use heavy vignetting and radial gradients to focus attention.

### B. Glassmorphism & Depth
Do not use flat backgrounds. Use "Glass" layers:
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### C. Typography
-   **Headings**: Large, Uppercase, Condensed/Display fonts (e.g., `Oswald`, `Impact`, `Bebas Neue`). Letters should be tight (`tracking-tight`).
-   **Body**: Clean, geometric sans-serif (e.g., `Montserrat`, `Inter`).

## 4. Key Component Patterns

### A. The "Cinematic" Hero
-   **Concept**: Instead of a static image, use a scroll-scrubbing video or image sequence rendered on a Canvas.
-   **Behavior**: The user controls the playback by scrolling.
-   **Fallback**: High-quality video background with overlay.
-   **Elements**:
    -   `h1` Brand Title (Massive).
    -   `h2` Hook/Promise (Animated entry).
    -   `Canvas` element for frame-by-frame rendering.

### B. The "Glass" Pricing Card
-   **Structure**:
    -   **Badge**: "Oferta Exclusiva" / "Vagas Limitadas" (Gold/Accent color).
    -   **Value Stack**: List everything included, assigning a monetary value to each, then striking it through.
    -   **Anchor Price**: Show the "Real Value" (e.g., R$ 2.500) crossed out.
    -   **Offer Price**: Large font for the installment price (e.g., "12x 39,90").
    -   **Visuals**: Use `GlowingEffect` behind the card or `SparklesCore` in the background to make it pop.

### C. Trust & Authority (Bio/Methodology)
-   **Layout**: Asymmetrical grids.
-   **Imagery**: High-contrast black & white photography with cutouts.
-   **Motion**: Elements should `fadeSlideIn` as they enter the viewport.

## 5. Conversion Triggers (Must Include)

1.  **Scarcity**: "Vagas limitadas", "Apenas X disponíveis".
2.  **Urgency**: Countdowns (authentic or evergreen), "Oferta encerra em breve".
3.  **Risk Reversal**: "Garantia Incondicional de 7 Dias" (use a badge/icon).
4.  **Social Proof**: Testimonials, subscriber counts, "Junte-se a X alunos".
5.  **Authority**: Association with known figures or results (e.g., "Campeão Olímpico").

## 6. Implementation Templates

### Tailwind Config (Crucial)
Ensure `tailwind.config.js` includes these colors and fonts:

```javascript
theme: {
  extend: {
    colors: {
      bg: '#050505',
      primary: '#ff1e1e',
      gold: '#f59e0b',
    },
    fontFamily: {
      display: ['Oswald', 'sans-serif'],
      body: ['Montserrat', 'sans-serif'],
    }
  }
}
```

### Motion Primitive (Fade Up)
Use this for almost every text element:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  Content
</motion.div>
```

## 7. Workflow for Agent
When asked to generate a landing page:
1.  **Establish the Vibe**: Ask for the "Hero" imagery and primary color.
2.  **Scaffold**: Set up the dark mode `index.css` and `tailwind.config.js` first.
3.  **Build Core**: Create the Hero (visual heavy) and Pricing (conversion heavy).
4.  **Refine**: Add particles, glows, and scroll animations last.
