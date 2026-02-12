// Temporary script to create the initial user
// Run once: node scripts/create-user.mjs
// Then delete this file

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://oosjcweqdosaiszqgbyu.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vc2pjd2VxZG9zYWlzenFnYnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTg2NjYsImV4cCI6MjA4NjM5NDY2Nn0.HMihfs3S0jdjfKQtH4mXVc59qB1kK-I1wILDUvrqpKE'
);

const { data, error } = await supabase.auth.signUp({
    email: 'artedesignercalhas@gmail.com',
    password: '123456',
});

if (error) {
    console.error('Error creating user:', error.message);
} else {
    console.log('User created successfully!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
}
