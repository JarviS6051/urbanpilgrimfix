import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import LoginForm from '../components/forms/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (user && token) {
      console.log('Already logged in, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, token, navigate]);

  const handleLoginSuccess = () => {
    console.log('Login successful, redirecting to home');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>
        <LoginForm onSuccess={handleLoginSuccess} />

        <p className="text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
