// 1. IMPORT: Like "from components.ui.shuffle_grid import ShuffleHero" in Python.
// This pulls in the actual animated grid logic from your UI folder.
import { ShuffleHero } from "@/components/ui/shuffle-grid";

/**
 * 2. COMPONENT DEFINITION: 
 * This is an "Arrow Function" (like a lambda in Python, but used for full functions).
 * It defines a "Section" of your webpage.
 */
const ShuffleHeroSection = () => {
  return (
    // 3. CALLING THE UI COMPONENT:
    // ShuffleHero is already a <section> element with full AXIS padding and background.
    // No wrapper div is needed — adding one would break the section spacing.
    // This actually executes the ShuffleHero code and places it on the page.
    <ShuffleHero />
  );
};

// 5. THE EXPORT (FIXED):
// WRONG: export default { ShuffleHeroSection };  <-- This exports a Dictionary/Object.
// RIGHT: export default ShuffleHeroSection;      <-- This exports the Function directly.
//
// In Python terms: This is the difference between:
// return {"func": ShuffleHeroSection}  vs  return ShuffleHeroSection
export default ShuffleHeroSection;
