'use client';
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ReturnForm() {
  const [loanId, setLoanId] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fine, setFine] = useState<number | null>(null);

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`/api/loans/return/${loanId}`);
      setStatus('success');
      setFine(res.data.fine);
      setTimeout(() => {
        setStatus('idle');
        setFine(null);
      }, 4000);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <motion.form
      onSubmit={handleReturn}
      className="bg-white/10 p-6 rounded-xl w-full max-w-lg mt-10 backdrop-blur-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-4">🔁 Return Book</h3>

      <input
        type="text"
        placeholder="Loan ID"
        value={loanId}
        onChange={(e) => setLoanId(e.target.value)}
        required
        className="w-full mb-4 px-4 py-2 rounded bg-white/5 border border-white/20 text-white"
      />

      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold transition"
      >
        Confirm Return
      </button>

      {status === 'success' && (
        <motion.div className="text-green-400 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ✅ Book returned.
          {fine && fine > 0 ? (
            <p className="text-sm mt-1">💰 Fine: <span className="font-bold">${fine}</span> — must be paid before next checkout.</p>
          ) : (
            <p className="text-sm mt-1">No fine incurred.</p>
          )}
        </motion.div>
      )}
      {status === 'error' && (
        <motion.p className="text-red-400 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ❌ Return failed. Please check the Loan ID.
        </motion.p>
      )}
    </motion.form>
  );
}
