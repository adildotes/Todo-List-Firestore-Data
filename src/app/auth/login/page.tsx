'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmailPassword } from '../../../firebase/firebaseauth';
import { ROUTES } from '../../../constants/routes';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // allow null or string for error state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // reset error state

    try {
      const userCredential = await loginWithEmailPassword(email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        router.push(ROUTES.PROFILE); // Redirect to profile if email is verified
      } else {
        router.push(ROUTES.VERIFY_EMAIL); // Redirect to verify-email page if not verified
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message); // Safely access the message
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <h1 className='text-2xl font-bold mb-6 text-center text-gray-700'>Login</h1>
        {error && <p className='text-red-600 text-center mb-4'>{error}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
          <input
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
          <button
            type='submit'
            className='w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300'>
            Login
          </button>
        </form>
      </div>
    </div>

  );
};

export default LoginPage;
