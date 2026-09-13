import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*'],
}
