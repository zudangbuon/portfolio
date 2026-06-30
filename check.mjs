import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lskfvhhssxumoawpjrro.supabase.co'
const supabaseKey = 'sb_publishable_XRG9LK-6zb5O9pEuDs878g_QcOh0D-3'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data: activities, error } = await supabase.from('activities').select('*').order('order_idx', { ascending: true });
  if (error) {
    console.error(error);
    return;
  }
  
  for (let a of activities) {
    console.log(`ID: ${a.id}`);
    console.log(`Role: ${a.role}`);
    console.log(`Tags:`, a.tags, `(isArray: ${Array.isArray(a.tags)})`);
  }
}
check();
