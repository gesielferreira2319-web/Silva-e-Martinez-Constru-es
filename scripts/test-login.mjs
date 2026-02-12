import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://oosjcweqdosaiszqgbyu.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vc2pjd2VxZG9zYWlzenFnYnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTg2NjYsImV4cCI6MjA4NjM5NDY2Nn0.HMihfs3S0jdjfKQtH4mXVc59qB1kK-I1wILDUvrqpKE'
);

console.log('Testing login...');
const { data, error } = await supabase.auth.signInWithPassword({
    email: 'artedesignercalhas@gmail.com',
    password: '123456',
});

if (error) {
    console.error('LOGIN FAILED:', error.message);
    console.error('Error details:', JSON.stringify(error, null, 2));
} else {
    console.log('LOGIN SUCCESS!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('Email confirmed:', data.user?.email_confirmed_at);
}
