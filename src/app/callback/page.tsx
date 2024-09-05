'use client'
import { useEffect, useState } from 'react'
import { handlePhantomCallback } from "@/utils/phantom"

export default function Callback() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Please wait while we complete the authentication process.');

  useEffect(() => {
    const performCallback = async () => {
      try {
        const result = await handlePhantomCallback();
        if (result) {
          setStatus('success');
          setMessage('Authentication Successful! Redirecting back to Telegram...');
          setTimeout(() => {
            window.location.href = `https://t.me/phantom_wallet_test_bot`;
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Authentication Failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    performCallback();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <h1 className={`text-3xl font-bold mb-6 ${getStatusColor()}`}>
          {status === 'loading' ? 'Authenticating...' : status === 'success' ? 'Authentication Successful' : 'Authentication Failed'}
        </h1>
        {status === 'loading' && (
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
        <p className="text-xl text-gray-700">
          {message}
        </p>
      </div>
    </main>
  );
}