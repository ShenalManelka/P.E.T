import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, ReceiptText } from 'lucide-react';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.clear(); 
    window.location.href = '/login'; // Hard refresh to wipe React state
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <ReceiptText size={22} strokeWidth={2.5}/>
          </div>
          <span className="font-black text-2xl text-slate-900 tracking-tighter">PET<span className="text-indigo-600">.</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1.5 font-bold">
          <NavLink to="/" className={({ isActive }) => `px-5 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all ${isActive ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
            <LayoutDashboard size={18} strokeWidth={2.5}/> Dashboard
          </NavLink>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          onClick={handleLogout}
          className="flex items-center gap-2 bg-rose-50 text-rose-600 px-5 py-2.5 rounded-2xl text-sm font-black hover:bg-rose-600 hover:text-white transition-all"
        >
          <LogOut size={16} strokeWidth={2.5} /> Logout
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;