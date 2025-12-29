import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import your axios instance

const Register = () => {
  // 1. Create state for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send data to your backend
      const response = await api.post('/auth/register', formData);
      
      // Save user to localStorage (so ProtectedRoute works)
      localStorage.setItem('user', JSON.stringify(response.data));
      
      navigate('/'); // Redirect to Dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-indigo-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400"><User size={18}/></span>
              <input 
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400"><Mail size={18}/></span>
              <input 
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400"><Lock size={18}/></span>
              <input 
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <motion.button 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition-colors mt-4 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Create Account'}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;