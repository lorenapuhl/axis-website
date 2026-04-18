// /contact — middleware redirects to /en/contact or /fr/contact
import { redirect } from "next/navigation"
export default function ContactPage() { redirect("/en/contact") }
