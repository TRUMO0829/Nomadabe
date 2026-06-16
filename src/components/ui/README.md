# UI Components Library

## Overview
This folder contains reusable, animated UI components built with Next.js, React, Tailwind CSS, and TypeScript.

## Available Components

### 1. **ParticleTextCanvas** (`particle-text-canvas.tsx`)
Interactive particle animation that responds to mouse movement.

**Features:**
- Animated text particles that react to cursor position
- Smooth particle physics simulation
- Responsive canvas auto-resizing
- Uses 2D canvas API for high performance

**Usage:**
```tsx
import ParticleText from "@/components/ui/particle-text-canvas";

export default function Demo() {
  return <ParticleText />;
}
```

**Best for:**
- Hero sections
- Landing pages
- Interactive backgrounds
- Engaging visual effects

---

### 2. **CardsParallax** (`scroll-cards.tsx`)
Beautiful parallax scroll card component with image backgrounds and text overlays.

**Features:**
- Sticky card positioning during scroll
- Full-viewport card height
- Gradient overlays for text readability
- Optional action buttons with callbacks
- Responsive image handling (Unsplash ready)

**Usage:**
```tsx
import { CardsParallax, type iCardItem } from "@/components/ui/scroll-cards";

const items: iCardItem[] = [
  {
    title: "Everest Camp",
    description: "Experience the ultimate trek",
    tag: "trekking",
    src: "https://images.unsplash.com/photo-...",
    link: "/trips/everest",
    color: "white",
    textColor: "white",
    actionLabel: "Explore"
  }
];

export default function Demo() {
  return <CardsParallax items={items} />;
}
```

**Best for:**
- Trip showcases
- Service highlights
- Portfolio sections
- Featured experiences

---

### 3. **BlurTextAnimation** (`blur-text-animation.tsx`)
Cinematic text animation with blur, brightness, and 3D transform effects.

**Features:**
- Word-by-word animation with staggered timing
- Customizable blur, scale, and 3D transforms
- Auto-repeating animation loop
- Fully configurable text and animation properties
- Smooth cubic-bezier transitions

**Usage:**
```tsx
import BlurTextAnimation from "@/components/ui/blur-text-animation";

export default function Demo() {
  return (
    <BlurTextAnimation 
      text="Your custom text here"
      fontSize="text-4xl md:text-5xl lg:text-6xl"
      textColor="text-white"
      animationDelay={4000}
    />
  );
}
```

**Props:**
- `text?: string` - Main text to animate
- `fontSize?: string` - Tailwind font size class
- `textColor?: string` - Tailwind color class
- `animationDelay?: number` - Delay between animations in ms
- `className?: string` - Additional wrapper classes

**Best for:**
- Marketing headlines
- Landing page taglines
- Feature announcements
- Cinematic introductions

---

## Setup Notes

✅ **All dependencies are already installed:**
- TypeScript
- Tailwind CSS 4
- Next.js 16
- React 19
- Lucide React (for icons if needed)

✅ **Path Alias:**
- `@/*` maps to `./src/*`
- Components can be imported as `@/components/ui/...`

✅ **Image Support:**
- Unsplash images are pre-configured
- Use `https://images.unsplash.com/...` URLs directly

## Integration Tips

1. **For Nomadabe's "Онцлох Аяллууд" section:**
   - Use `CardsParallax` with featured trips data
   - Use `BlurTextAnimation` for section headlines in Mongolian
   - Add particle effect as page background

2. **Performance:**
   - Particle canvas is heavy; use once per page
   - Lazy load image-heavy scroll-cards
   - Consider component visibility optimization

3. **Styling:**
   - All components use Tailwind utility classes
   - Colors are customizable via props or inline styles
   - Gradient overlays ensure text readability

4. **Mobile Responsiveness:**
   - Scroll-cards adapts to mobile screens
   - Particle canvas scales to viewport
   - Text animation uses responsive font sizes

## Example Integration

See usage examples in component files or create demo pages in `/src/app/`.
