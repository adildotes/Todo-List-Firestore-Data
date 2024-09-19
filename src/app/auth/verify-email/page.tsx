'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { resendVerificationEmail } from '../../../firebase/firebaseauth';
import { ROUTES } from '../../../constants/routes';

const VerifyEmailPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Function to periodically check if the user's email is verified
  const checkEmailVerified = async () => {
    try {
      if (user) {
        await user.reload(); // Reload the user from Firebase to get the latest email verification status
        if (user.emailVerified) {
          router.push(ROUTES.PROFILE); // Redirect to profile page if email is verified
        }
      }
    } catch (err) {
      console.error('Error checking email verification status:', err);
    }
  };

  // Resend the verification email
  const handleResendVerification = async () => {
    if (user) {
      try {
        await resendVerificationEmail(user);
        setMessage('Verification email resent. Please check your inbox.');
      } catch (err) {
        setError('Failed to resend verification email.');
      }
    } else {
      setError('No user is logged in.');
    }
  };

  // Check periodically if the user has verified their email
  useEffect(() => {
    const interval = setInterval(() => {
      checkEmailVerified();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Verify Your Email</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <p className="mb-6 text-gray-600">Please verify your email before accessing your account. Check your inbox for the verification link.</p>
        <button
          onClick={handleResendVerification}
          className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">
          Resend Verification Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
