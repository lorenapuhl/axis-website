// /about — middleware redirects to /en/about or /fr/about
import { redirect } from "next/navigation"
export default function AboutPage() { redirect("/en/about") }
