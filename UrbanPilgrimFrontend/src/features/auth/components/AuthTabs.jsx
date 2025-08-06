import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserSignupForm from './forms/UserSignupForm';
import TrainerSignupForm from './forms/TrainerSignupForm';

export default function AuthTabs() {
  const [tab, setTab] = useState('user');
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleAuthSuccess = (result) => {
    console.log('Auth success in AuthTabs:', result);
    setSuccess(result);
    // Navigate to home page after 1 second
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);
  };

  const getDisplayName = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || user?.lastName || user?.email || 'User';
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg mb-10">
      {/* Tab Headers */}
      <div className="flex mb-6">
        <button
          className={`flex-1 py-2 font-medium transition-colors duration-150 border-b-2 ${
            tab === 'user'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent hover:text-blue-600'
          }`}
          onClick={() => setTab('user')}
        >
          User Signup
        </button>
        <button
          className={`flex-1 py-2 font-medium transition-colors duration-150 border-b-2 ${
            tab === 'trainer'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent hover:text-blue-600'
          }`}
          onClick={() => setTab('trainer')}
        >
          Trainer Signup
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="text-green-600 mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-center">
          Success! Welcome, {getDisplayName(success.user)}. Redirecting to home page...
        </div>
      )}

      {/* Forms */}
      {tab === 'user' && <UserSignupForm onSuccess={handleAuthSuccess} />}
      {tab === 'trainer' && <TrainerSignupForm onSuccess={handleAuthSuccess} />}

      {/* Login Redirect */}
      <p className="text-sm text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
