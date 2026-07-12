require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabase } = require('../src/utils/supabase');

async function main() {
  const hashedPassword = await bcrypt.hash('yash1234', 10);
  console.log('Creating yash@g.com user...');

  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        email: 'yash@g.com',
        password: hashedPassword,
        name: 'Yash',
      },
      { onConflict: 'email' }
    );

  if (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }

  console.log('✅ User created or updated!');
  console.log('Email: yash@g.com');
  console.log('Password: yash1234');
}

main().catch(console.error);