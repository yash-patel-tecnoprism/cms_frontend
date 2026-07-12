require('dotenv').config();
const { supabase } = require('../src/utils/supabase');

const dummyCustomers = [
  { name: 'Alice Smith', email: 'alice.smith@example.com', phone: '+1 555-100-1001' },
  { name: 'Bob Johnson', email: 'bob.j@example.com', phone: '+1 555-100-1002' },
  { name: 'Charlie Brown', email: 'charlie.b@example.com', phone: '+1 555-100-1003' },
  { name: 'Diana Prince', email: 'diana.p@example.com', phone: '+1 555-100-1004' },
  { name: 'Ethan Hunt', email: 'ethan.h@example.com', phone: '+1 555-100-1005' },
  { name: 'Fiona Green', email: 'fiona.g@example.com', phone: '+1 555-100-1006' },
  { name: 'George Miller', email: 'george.m@example.com', phone: '+1 555-100-1007' },
  { name: 'Hannah Lee', email: 'hannah.l@example.com', phone: '+1 555-100-1008' },
  { name: 'Ian Wright', email: 'ian.w@example.com', phone: '+1 555-100-1009' },
  { name: 'Julia Roberts', email: 'julia.r@example.com', phone: '+1 555-100-1010' },
  { name: 'Kevin Spacey', email: 'kevin.s@example.com', phone: '+1 555-100-1011' },
  { name: 'Laura Dern', email: 'laura.d@example.com', phone: '+1 555-100-1012' },
  { name: 'Michael Scott', email: 'michael.s@example.com', phone: '+1 555-100-1013' },
  { name: 'Nancy Drew', email: 'nancy.d@example.com', phone: '+1 555-100-1014' },
  { name: 'Oscar Wilde', email: 'oscar.w@example.com', phone: '+1 555-100-1015' },
  { name: 'Pam Beesly', email: 'pam.b@example.com', phone: '+1 555-100-1016' },
  { name: 'Quentin Tarantino', email: 'quentin.t@example.com', phone: '+1 555-100-1017' },
  { name: 'Rachel Green', email: 'rachel.g@example.com', phone: '+1 555-100-1018' },
  { name: 'Steve Jobs', email: 'steve.j@example.com', phone: '+1 555-100-1019' },
  { name: 'Tina Fey', email: 'tina.f@example.com', phone: '+1 555-100-1020' },
  { name: 'Uma Thurman', email: 'uma.t@example.com', phone: '+1 555-100-1021' },
  { name: 'Vin Diesel', email: 'vin.d@example.com', phone: '+1 555-100-1022' },
  { name: 'Winnie Cooper', email: 'winnie.c@example.com', phone: '+1 555-100-1023' },
  { name: 'Xavier Dolan', email: 'xavier.d@example.com', phone: '+1 555-100-1024' },
  { name: 'Yvonne Strahovski', email: 'yvonne.s@example.com', phone: '+1 555-100-1025' },
  { name: 'Zach Galifianakis', email: 'zach.g@example.com', phone: '+1 555-100-1026' },
];

async function main() {
  console.log('Adding dummy customers...');

  const { data, error } = await supabase
    .from('customers')
    .upsert(dummyCustomers, { onConflict: 'email' });

  if (error) {
    console.error('Error adding customers:', error);
    process.exit(1);
  }

  console.log(`✅ Added ${dummyCustomers.length} dummy customers! Ready to test pagination!`);
}

main().catch(console.error);