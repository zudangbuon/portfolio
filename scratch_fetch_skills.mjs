import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lskfvhhssxumoawpjrro.supabase.co';
const supabaseKey = 'sb_publishable_XRG9LK-6zb5O9pEuDs878g_QcOh0D-3';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: skills, error } = await supabase.from('skills').select('*');
  if (error) {
    console.error(error);
  } else {
    console.log("Current skills:", skills.map(s => ({id: s.id, name: s.name, category: s.category})));
  }
}

run();
