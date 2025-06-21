'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md text-white"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center tracking-wide">
          InfoNest X — Secure Login
        </h2>

        {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}

        <label className="block mb-2">Email</label>
        <input
          type="email"
          required
          className="w-full mb-4 px-4 py-2 rounded bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          required
          className="w-full mb-6 px-4 py-2 rounded bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 transition rounded text-white font-semibold"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
