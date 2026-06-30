import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lskfvhhssxumoawpjrro.supabase.co';
const supabaseKey = 'sb_publishable_XRG9LK-6zb5O9pEuDs878g_QcOh0D-3';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('blogs').select('*');
  console.log("Blogs error:", error);
  console.log("Blogs data:", data);
}

check();
