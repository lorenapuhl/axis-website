# Skill: animate-section.md

Add scroll-triggered animation to a section using Framer Motion.

## Timing guidance
- Default: duration 0.7s
- Headlines and hero elements: duration 0.8s
- Small elements, labels, subtle moves: duration 0.4s
- Always ease: "easeOut"
- Stagger between children: 0.12s
- Never go below 0.4s or above 0.8s — animations should feel slow and confident

## Wrap the section content:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  viewport={{ once: true }}
>
```

## Stagger children:
```tsx
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 }
  }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
}

<motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  <motion.p variants={item}>Line one</motion.p>
  <motion.p variants={item}>Line two</motion.p>
</motion.div>
```
