import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Plus, Trash2, LayoutGrid, TrendingUp, 
  TrendingDown, Activity, PieChart as PieIcon, Download 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import api from '../services/api';
import AddTransactionModal from '../components/AddTransactionModal';
import { downloadCSV } from '../utils/exportCSV';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currency, setCurrency] = useState({ symbol: '$', code: 'USD' });

  const fetchData = async () => {
    try {
      const { data } = await api.get('/expenses');
      setTransactions(data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async (formData) => {
    try {
      const { data } = await api.post('/expenses', formData);
      setTransactions([data, ...transactions]);
    } catch (err) {
      console.error("Error adding", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting", err);
    }
  };

  // Calculations
  const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expenses;

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, item) => {
      const existing = acc.find(a => a.name === item.category);
      if (existing) existing.value += item.amount;
      else acc.push({ name: item.category, value: item.amount });
      return acc;
    }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="p-4 bg-indigo-600 rounded-2xl">
        <Activity className="text-white" />
      </motion.div>
    </div>
  );

  return (
    // Updated Background Wrapper
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
              <Activity size={16} className="text-indigo-500" />
              Tracking {transactions.length} transactions
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-slate-200">
              {[{ s: '$', c: 'USD' }, { s: 'Rs', c: 'LKR' }].map((curr) => (
                <button 
                  key={curr.c}
                  onClick={() => setCurrency({ symbol: curr.s, code: curr.c })}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${currency.code === curr.c ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {curr.c}
                </button>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => downloadCSV(transactions)}
              className="bg-white/80 backdrop-blur-md text-slate-700 border border-slate-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Download size={20} /> Export CSV
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-100"
            >
              <Plus size={20} strokeWidth={3} /> Add New
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Balance" amount={balance} icon={<Wallet />} gradient="from-slate-800 to-slate-900" symbol={currency.symbol} />
          <StatCard title="Income" amount={income} icon={<TrendingUp />} gradient="from-emerald-500 to-teal-600" symbol={currency.symbol} />
          <StatCard title="Expenses" amount={expenses} icon={<TrendingDown />} gradient="from-rose-500 to-orange-600" symbol={currency.symbol} />
        </div>

        {/* Analytics & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Bar Chart */}
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/50">
              <h3 className="font-bold text-slate-800 mb-6 text-lg">Spending Analytics</h3>
              <div className="h-[350px] w-full">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={45} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState icon={<TrendingDown size={40}/>} message="No expense data to analyze" />
                )}
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-white/50 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><LayoutGrid size={20} /></div>
                Recent Transactions
              </h3>
              <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                  {transactions.length > 0 ? (
                    transactions.slice(0, 8).map((item) => (
                      <TransactionItem key={item._id} item={item} symbol={currency.symbol} onDelete={() => handleDelete(item._id)} />
                    ))
                  ) : (
                    <p className="text-center py-10 text-slate-400 font-medium italic">No transactions found.</p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Pie Chart Breakdown */}
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/50 sticky top-28">
              <h3 className="font-bold text-slate-800 mb-6 text-lg flex items-center gap-2">
                <PieIcon size={18} className="text-indigo-500" /> Expense Split
              </h3>
              <div className="h-[250px] w-full">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState icon={<PieIcon size={40}/>} message="No categories" />
                )}
              </div>
              
              <div className="mt-8 space-y-3">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                    <span className="flex items-center gap-3 font-bold text-slate-600 text-sm">
                       <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div> 
                       {cat.name}
                    </span>
                    <span className="text-slate-900 font-black text-sm">{currency.symbol}{cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddTransaction} />
      </motion.div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, amount, icon, gradient, symbol }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-gradient-to-br ${gradient} rounded-[2.5rem] p-8 text-white shadow-lg flex justify-between items-center relative overflow-hidden`}
  >
    <div className="relative z-10">
      <p className="text-white/70 text-xs font-black uppercase tracking-widest">{title}</p>
      <h2 className="text-3xl font-black mt-2">{symbol}{amount.toLocaleString()}</h2>
    </div>
    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl relative z-10 shadow-inner">
      {icon}
    </div>
  </motion.div>
);

const TransactionItem = ({ item, symbol, onDelete }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, x: -20 }}
    className="flex items-center justify-between p-4 rounded-3xl hover:bg-white/50 transition-all border border-transparent hover:border-white/80"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {item.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
      </div>
      <div>
        <h4 className="font-bold text-slate-800">{item.title}</h4>
        <p className="text-xs text-slate-400 font-bold">{item.category} • {new Date(item.date).toLocaleDateString()}</p>
      </div>
    </div>
    <div className="flex items-center gap-5">
      <span className={`font-black ${item.type === 'income' ? 'text-emerald-500' : 'text-slate-900'}`}>
        {item.type === 'income' ? '+' : '-'}{symbol}{item.amount.toLocaleString()}
      </span>
      <button onClick={() => onDelete(item._id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1">
        <Trash2 size={18} />
      </button>
    </div>
  </motion.div>
);

const EmptyState = ({ icon, message }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
    {icon}
    <p className="font-bold text-sm">{message}</p>
  </div>
);

export default Dashboard;