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
  const [polling, setPolling] = useState(true);

  // Check email verification status and stop polling if verified
  const checkEmailVerified = async () => {
    try {
      if (user) {
        await user.reload(); 
        if (user.emailVerified) {
          setPolling(false);
          router.push(ROUTES.PROFILE);
        }
      }
    } catch (err) {
      console.error('Error checking email verification status:', err);
      setError('Error checking email verification status. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    if (user) {
      try {
        await resendVerificationEmail(user);
        setMessage('Verification email resent. Please check your inbox.');
      } catch (err) {
        setError('Failed to resend verification email.');
      }
    }
  };

  // Polling logic for checking email verification
  useEffect(() => {
    if (!user) return;

    checkEmailVerified(); // Check immediately

    const interval = setInterval(() => {
      if (polling) {
        checkEmailVerified();
      }
    }, 5000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPolling(false); 
    }, 60000); 

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [user, polling]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Verify Your Email</h1>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {polling ? (
          <p className="mb-6 text-gray-600">
            We are checking your email verification status...
          </p>
        ) : (
          <p className="mb-6 text-gray-600">
            Email verification timed out. Please check your inbox and verify your email.
          </p>
        )}

        <button
          onClick={handleResendVerification}
          className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
        >
          Resend Verification Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
