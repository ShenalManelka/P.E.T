import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; // 1. Import your Auth Hook

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth(); // 2. Destructure login function from Context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 3. Call backend
      const { data } = await api.post('/auth/login', { email, password });

      // 4. Update Global State + LocalStorage via Context
      // This ensures ProtectedRoute sees the user immediately
      login(data); 

      // 5. Navigate to dashboard
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 border border-gray-100"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200"
          >
            <LogIn className="text-white" size={30} />
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2 font-medium">Please enter your details</p>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-500 text-sm mt-4 bg-red-50 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Sign In <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        <p className="text-center mt-8 text-gray-600 font-medium">
          New here? <Link to="/register" className="text-indigo-600 hover:underline">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;