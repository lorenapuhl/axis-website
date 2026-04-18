// Root redirect — /
// Middleware handles the actual redirect to /en or /fr.
// This file exists only as a fallback; it should never render.

import { redirect } from "next/navigation"

export default function RootPage() {
  redirect("/en")
}
