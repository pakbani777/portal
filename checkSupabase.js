const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bodfmgacldijewceqymz.supabase.co';
const supabaseKey = 'sb_publishable_Iz9gGDjlhnGZeKS9DUVuQQ_7Dg6Q0lK';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTugas() {
  console.log('Checking tugas table...');
  const { data, error } = await supabase.from('tugas').select('*').limit(1);
  if (error) {
    console.error('Error fetching tugas table:', error.message);
  } else {
    console.log('Success! Table exists.');
    console.log('Data:', data);
    
    // We can also try to insert a dummy task and see if link_tugas is accepted, then delete it.
    console.log('Checking link_tugas column specifically by inserting a dummy task...');
    const { data: inserted, error: insertError } = await supabase.from('tugas').insert([{
      judul: 'Test Link Tugas',
      deskripsi: 'Test Description',
      deadline: new Date().toISOString(),
      kelas: '7',
      link_tugas: 'https://example.com'
    }]).select();
    
    if (insertError) {
      console.error('Insert error (probably link_tugas column missing):', insertError.message);
    } else {
      console.log('Insert success! link_tugas column exists.');
      
      // Cleanup
      await supabase.from('tugas').delete().eq('id', inserted[0].id);
      console.log('Test record cleaned up.');
    }
  }
}

checkTugas();
