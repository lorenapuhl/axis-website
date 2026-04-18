// SectionWrapper — constrained inner content container
//
// Use this INSIDE a <section> element to constrain content width and
// maintain consistent horizontal padding across all sections.
//
// Every section in components/sections/ wraps its content in this component.
//
// This is a Server Component — no client-side features needed.

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({
  children,
  className = "",
}: SectionWrapperProps) {
  // max-w-6xl  = max content width of 72rem (1152px)
  // mx-auto    = horizontally center the container
  // These match the spec: "Content is wrapped in: max-w-6xl mx-auto"
  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {children}
    </div>
  );
}
