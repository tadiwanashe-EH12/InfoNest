'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Loan {
  memberName: string;
  bookTitle: string;
  dueDate: string;
  isOverdue: boolean;
}

export default function ActiveLoansTable() {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchLoans = async () => {
      const res = await axios.get('/api/reports/active-loans');
      setLoans(res.data);
    };
    fetchLoans();
  }, []);

  return (
    <motion.div
      className="bg-white/10 p-6 rounded-xl mt-10 backdrop-blur-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-4">📚 Active Loans</h3>
      <table className="w-full text-sm text-left">
        <thead className="text-gray-300 border-b border-white/20">
          <tr>
            <th className="py-2">Member</th>
            <th>Book</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan, i) => (
            <tr key={i} className="border-b border-white/10 hover:bg-white/5">
              <td className="py-2">{loan.memberName}</td>
              <td>{loan.bookTitle}</td>
              <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    loan.isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {loan.isOverdue ? 'Overdue' : 'On Time'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
