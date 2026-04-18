// /pricing — middleware redirects to /en/pricing or /fr/pricing
import { redirect } from "next/navigation"
export default function PricingPage() { redirect("/en/pricing") }
