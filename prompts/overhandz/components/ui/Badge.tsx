// Badge — small label chip, e.g. "3 spots left", "Best Value", "Free"
//
// This is a Server Component (no browser APIs, no hooks) — it renders
// purely on the server as static HTML.

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "urgent"; // urgent = red tint when spots are low
}

export default function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  // bg-white/10 = white with 10% opacity — creates a subtle frosted look
  const base = "inline-block text-xs px-2 py-1 rounded font-medium";
  const defaultStyle = "bg-white/10 text-white";
  // For urgency (e.g. "Only 2 spots left") — slightly warm tint
  const urgentStyle = "bg-white/20 text-lift";

  return (
    <span className={`${base} ${variant === "urgent" ? urgentStyle : defaultStyle} ${className}`}>
      {children}
    </span>
  );
}
