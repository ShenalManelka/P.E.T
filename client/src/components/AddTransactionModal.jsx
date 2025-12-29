import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, PlusCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    expense: ['Food', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If it's income, we use the Category name as the title since description is hidden
    const submissionData = {
      ...formData,
      amount: Number(formData.amount),
      title: formData.type === 'income' ? formData.category : formData.title
    };

    onAdd(submissionData);
    onClose();
    
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">New Transaction</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'expense', category: 'Food'})}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${formData.type === 'expense' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-500'}`}
            >
              <ArrowDownCircle size={18}/> Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'income', category: 'Salary'})}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${formData.type === 'income' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-500'}`}
            >
              <ArrowUpCircle size={18}/> Income
            </button>
          </div>

          <div className="space-y-4">
            {/* Conditional Rendering: Only show Description if NOT Income */}
            {formData.type !== 'income' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2 uppercase">Description</label>
                <input 
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="e.g. Grocery Shopping"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 ml-2 uppercase">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-4 font-bold text-gray-400 text-lg">රු</span>
                <input 
                  type="number"
                  required
                  className="w-full pl-12 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-xl"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 ml-2 uppercase">Category</label>
              <select 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-medium appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {categories[formData.type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 ml-2 uppercase">Date</label>
              <input 
                type="date"
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-medium"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2">
            <PlusCircle size={20}/> Save {formData.type === 'income' ? 'Income' : 'Expense'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTransactionModal;