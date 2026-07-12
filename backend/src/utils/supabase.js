const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    transport: null,
  }
});

const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('customers').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection failed:', error.message);
      return false;
    }
    console.log('Successfully connected to Supabase!');
    return true;
  } catch (err) {
    console.error('Error checking Supabase connection:', err.message);
    return false;
  }
};

module.exports = { supabase, checkSupabaseConnection };
