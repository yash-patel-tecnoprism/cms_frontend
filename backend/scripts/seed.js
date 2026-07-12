require('dotenv').config();

const bcrypt = require('bcryptjs');
const { supabase } = require('../src/utils/supabase');

async function main() {
  const hashedPassword = await bcrypt.hash('yash1234', 10);

  const { error: userError } = await supabase
    .from('users')
    .upsert(
      {
        email: 'yash@g.com',
        password: hashedPassword,
        name: 'Admin User',
      },
      { onConflict: 'email' }
    );
  if (userError) {
    throw userError;
  }

  const sampleCustomers = [
    { name: 'John Doe', email: 'john@example.com', phone: '+1 555-123-4567' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '+1 555-987-6543' },
    { name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 555-456-7890' },
  ];

  const { error: customersError } = await supabase
    .from('customers')
    .upsert(sampleCustomers, { onConflict: 'email' });
  if (customersError) {
    throw customersError;
  }

  console.log('Default admin user created or updated.');
  console.log('Email: admin@example.com');
  console.log('Password: password123');
  console.log('Sample customers added or updated.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
