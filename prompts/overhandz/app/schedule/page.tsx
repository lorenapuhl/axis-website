// /schedule — middleware redirects to /en/schedule or /fr/schedule
import { redirect } from "next/navigation"
export default function SchedulePage() { redirect("/en/schedule") }
