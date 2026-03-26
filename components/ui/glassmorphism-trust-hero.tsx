// "use client" is a directive that tells Next.js to run this code in the user's browser.
// Think of it like a Python import that requires a specific environment (like a GUI library).
"use client"

// Import the animation engine. 'motion' is like a CSS-supercharger for HTML tags.
import { motion } from "framer-motion"

// Importing specific social media icons. These act like custom HTML tags (<SiInstagram />).
import {
  SiInstagram,
  SiGoogle,
  SiStripe,
  SiGooglemaps,
  SiWhatsapp,
  SiFacebook,
  SiX,
} from "@icons-pack/react-simple-icons"

// Importing general UI icons (arrows, stars, etc.) to use as visual elements.
import { 
  ArrowRight, 
  Play, 
  Target, 
  Crown, 
  Star,
  Hexagon,
  Triangle,
  Command,
  Ghost,
  Gem,
  Cpu
} from "lucide-react";

// --- MOCK BRANDS ---
// A List of Dictionaries (Python terminology). We use this to loop (map) through brands later.
const BRANDS = [
  { name: "Instagram", Icon: SiInstagram },
  { name: "Google", Icon: SiGoogle },
  { name: "Stripe", Icon: SiStripe },
  { name: "Google Maps", Icon: SiGooglemaps },
  { name: "WhatsApp", Icon: SiWhatsapp },
  { name: "Facebook", Icon: SiFacebook },
  { name: "X (Twitter)", Icon: SiX },
]

// Another List of Dictionaries containing the text for the small statistics boxes.
const STATS = [
  { value: "<7 Days",      label: "Average Setup Time" },
  { value: "100%",        label: "Instagram Content Sync" },
  { value: "24/7",        label: "Automated Booking" },
  { value: "SEO Ready", label: "Google Search Optimized" },
]

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────

// Framer Motion "variants" define named animation states. The parent `container`
// variant triggers its children to animate one after another (staggerChildren).
// This creates the effect of elements assembling from top to bottom on the left.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 }, // Like a 'time.sleep()' between elements appearing.
  },
}

// This defines the "Child" animation: start invisible and 20px down, end visible at 0px.
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
}

// --- SUB-COMPONENTS ---
// A reusable function (component) that returns HTML for a single stat (e.g., "5+ Years").
const StatItem = ({ value, label }: { value: string; label: string }) => (
  /* THE CONTAINER DIV
     flex: display: flex;
     flex-col: flex-direction: column; (stacks items vertically)
     items-center: align-items: center; (centers horizontally in a column)
     justify-center: justify-content: center; (centers vertically in a column)
     transition-transform: transition-property: transform; (makes movements smooth)
     hover:-translate-y-1: transform: translateY(-4px) on hover; (lifts it up slightly)
     cursor-default: cursor: default; (keeps the arrow pointer instead of a text cursor)
  */
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    
    {/* THE VALUE (Big Number)
       text-xl: font-size: 20px;
       font-bold: font-weight: 700;
       text-white: color: #ffffff;
       sm:text-2xl: @media (min-width: 640px) { font-size: 24px; } (Responsive scaling)
    */}
    <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
    
    {/* THE LABEL (Small Description)
       text-[10px]: font-size: 10px; (Custom value in brackets)
       uppercase: text-transform: uppercase;
       tracking-wider: letter-spacing: 0.05em;
       text-zinc-500: color: #71717a; (A neutral medium-gray)
       font-medium: font-weight: 500;
       sm:text-xs: @media (min-width: 640px) { font-size: 12px; }
    */}
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
    
  </div>
);

// --- MAIN COMPONENT ---
// This is the main "HeroSection" function that builds the whole visual area.
export default function HeroSection() {
  return (
    // Outer Wrapper: 'bg-zinc-950' is a CSS color (near black), 'relative' allows absolute positioning inside.
    <div className="relative w-full bg-zinc-950 text-white overflow-hidden font-instrument">
      
      {/* CSS Block: We are defining raw CSS animations here for the "fade" and "marquee" effects. */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite; 
        }
        /* Delays so elements don't all pop in at the exact same millisecond */
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
      
     {/* --- Outer wrappers:
  1. THE SHELL (Relative/Max-W-7xl): 
     Acts as the "container" for the whole page section. 
     - "max-w-7xl" prevents your site from stretching too wide on massive iMac screens.
     - "mx-auto" is the standard CSS trick (margin: 0 auto) to keep this container centered.
     - "px-4/6/8" are the "gutters" (padding) so your text doesn't touch the edge of a phone screen.

  2. THE GRID SYSTEM (Grid/Grid-cols-12): 
     This is your "Spreadsheet" layout. 
     - By default (on phones), it uses 1 column ("grid-cols-1") so things stack vertically.
     - On laptops ("lg:"), it switches to a 12-column layout. 
     - "gap-12" is the 'gutters' between your columns so items don't touch.

  3. THE LAYOUT LOGIC (Items-start):
     - This ensures that if one column has more text than the other, the shorter column 
       doesn't "stretch" to match it. They both stay aligned to the top.
--- */} 
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

          {/* --- LEFT COLUMN (Text and Buttons) --- */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">

            {/* Main Title: Uses 'leading-[0.9]' for tight line spacing. */}
            <h1 
              className="font-playfair animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tighter leading-[0.9]"

            >Turn your Instagram into a Booking Machine
            </h1>

            {/* Sub-header text (Paragraph) */}
            <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-400 leading-relaxed">
          We build high-converting websites for boutique fitness studios tha sync
          automatically with your Instagram. Stop chasing DMs and start selling
          memberships 24/7.
            </p>

		{/* Action Buttons Container */}
		<motion.div variants={item}>
		  <motion.button
		    whileHover={{ scale: 1.03 }}
		    transition={{ duration: 0.35, ease: "easeOut" }}
		    className="bg-white-axis text-black-axis font-instrument text-xs font-semibold uppercase tracking-[0.2em] px-9 py-4"
		  >
		    Get your AXIS
		  </motion.button>
		</motion.div>
          </div>

          {/* --- RIGHT COLUMN (Stats and Cards) --- */}
          <div className="lg:col-span-5 space-y-6 lg:mt-12">
            
            {/* Main Stats Card: Uses 'backdrop-blur' for a glass-like effect. */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
              {/* Decorative Glow: A blurred circle in the corner for visual polish. */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Header of the card (Icon + 150+ Projects) */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <SiInstagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-white">150+</div>
                    <div className="text-sm text-zinc-400">Projects Delivered</div>
                  </div>
                </div>

                {/* Visual Progress Bar Section */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Client Satisfaction</span>
                    <span className="text-white font-medium">98%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                    {/* The bar itself, set to 98% width via CSS class 'w-[98%]' */}
                    <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-white to-zinc-400" />
                  </div>
                </div>

                {/* Horizontal Divider Line */}
                <div className="h-px w-full bg-white/10 mb-6" />

                {/* 3-Column Mini Stats Row */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatItem value="5+" label="Years" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="24/7" label="Support" />
                  <div className="w-px h-full bg-white/10 mx-auto" />
                  <StatItem value="100%" label="Quality" />
                </div>

                {/* Status Badges (Active with pulse and Premium with crown) */}
                <div className="mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    {/* The green pulsing dot */}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    SYNC
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <Crown className="w-3 h-3 text-yellow-500" />
                    PREMIUM
                  </div>
                </div>
              </div>
            </div>

            {/* Marquee (Scrolling Logos) Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
              <h3 className="mb-6 px-8 text-sm font-medium text-zinc-400">Integrated with the Tools You Use</h3>
              
              <div 
                className="relative flex overflow-hidden"
                style={{
                  // Fades the left and right edges of the scrolling area.
                  maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
                }}
              >
                {/* The Infinite Loop: We repeat the BRANDS list 3 times to ensure no gaps during animation. */}
                <div className="animate-marquee flex gap-12 whitespace-nowrap px-4">
                  {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-2 opacity-50 transition-all hover:opacity-100 hover:scale-105 cursor-default grayscale hover:grayscale-0"
                    >
                      {/* Name of the brand from the dictionary. */}
                      <brand.Icon color="currentColor" size={18} />
                      <span className="text-lg font-bold text-white tracking-tight">
                        {brand.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
