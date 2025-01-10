import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext); // Get the login function from context
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Authenticate user and get token
      const token = await loginService(formData);
      
      // Save user details to context
      login({ email: formData.email, token });

      // Persist token in localStorage
      localStorage.setItem('token', token);

      // Navigate to the home page
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Please sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out font-medium"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <span
              onClick={() => navigate('/signup')}
              className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium transition duration-150 ease-in-out"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
