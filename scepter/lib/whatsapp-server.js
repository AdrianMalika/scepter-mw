import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const FALLBACK_WHATSAPP_NUMBER = '265889545477';

const getCachedWhatsAppNumber = unstable_cache(
  async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return FALLBACK_WHATSAPP_NUMBER;
    }

    const supabase = createSupabaseClient(url, anonKey);
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'whatsapp_number')
      .maybeSingle();

    if (error || !data || !data.value) {
      return FALLBACK_WHATSAPP_NUMBER;
    }
    return data.value;
  },
  ['whatsapp-number'],
  { revalidate: 300 }
);

export async function getWhatsAppNumber() {
  try {
    return await getCachedWhatsAppNumber();
  } catch {
    return FALLBACK_WHATSAPP_NUMBER;
  }
}
