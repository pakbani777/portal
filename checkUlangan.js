const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://bodfmgacldijewceqymz.supabase.co', 'sb_publishable_Iz9gGDjlhnGZeKS9DUVuQQ_7Dg6Q0lK');
async function check() {
  const { data, error } = await supabase.from('ulangan').select('*').limit(1);
  console.log(data);
}
check();
