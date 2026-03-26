// 1. IMPORTING TOOLS: Like "from library import function" in Python.
// clsx: A tool that lets you toggle CSS classes on/off using logic (like an if-statement).
// Example:
//import { clsx } from "clsx"
//const isActive = true
//const isDisabled = false
// clsx takes different "inputs" and merges them:
//const buttonClass = clsx(
//  "btn",               // 1. A permanent string (Always included)
//  "btn-large",         // 2. Another permanent string
//  isActive && "bg-blue",   // 3. Conditional: Only if isActive is true
//  isDisabled && "opacity-50" // 4. Conditional: Only if isDisabled is true
//)
// Output: "btn btn-large bg-blue"
// twMerge: A tool that prevents "CSS conflicts" (e.g., if you accidentally say "bg-red" and "bg-blue", it picks the last one).
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * THE "cn" FUNCTION (Short for "Class Name")
 * * Python Analogy: 
 * def cn(*args):
 * return merge_css_logic(clean_logic(args))
 */
export function cn(...inputs: ClassValue[]) {
  // ...inputs: This is like *args in Python. It collects all arguments into one list.
  // clsx(inputs): This takes your list of classes and resolves any "if/else" logic.
  // twMerge(...): This looks at the final string and ensures no Tailwind classes conflict.
  
  return twMerge(clsx(inputs))
}
