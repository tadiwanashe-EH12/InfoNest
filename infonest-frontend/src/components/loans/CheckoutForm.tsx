'use client';
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function CheckoutForm() {
  const [memberId, setMemberId] = useState('');
  const [copyId, setCopyId] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/loans/checkout', { memberId, copyId });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white/10 p-6 rounded-xl shadow-md w-full max-w-lg backdrop-blur"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-semibold mb-4">📖 Checkout Book</h3>

      <input
        type="text"
        placeholder="Member ID"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded bg-white/5 border border-white/20 text-white"
        required
      />

      <input
        type="text"
        placeholder="Copy ID (Scan/Enter)"
        value={copyId}
        onChange={(e) => setCopyId(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded bg-white/5 border border-white/20 text-white"
        required
      />

      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 w-full py-2 rounded text-white font-semibold transition"
      >
        Confirm Checkout
      </button>

      {status === 'success' && (
        <motion.p className="text-green-400 mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ✅ Book successfully checked out!
        </motion.p>
      )}
      {status === 'error' && (
        <motion.p className="text-red-400 mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ❌ Something went wrong. Please try again.
        </motion.p>
      )}
    </motion.form>
  );
}
