const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bodfmgacldijewceqymz.supabase.co';
const supabaseKey = 'sb_publishable_Iz9gGDjlhnGZeKS9DUVuQQ_7Dg6Q0lK';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}
test();
