import DashboardLayout from '@/components/layout/DashboardLayout';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function DashboardPage() {
  const stats = [
    { label: 'Books', value: 528 },
    { label: 'Members', value: 134 },
    { label: 'Active Loans', value: 27 },
    { label: 'Unpaid Fines', value: 5 },
  ];

  const data = {
    labels: ['Loans', 'Returns', 'Fines'],
    datasets: [
      {
        label: 'Weekly Activity',
        data: [12, 8, 4],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Librarian 👋</h2>
        <p className="text-gray-300">Here's your VIP intel snapshot:</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl text-center shadow hover:scale-105 transition transform"
          >
            <h3 className="text-lg text-gray-300">{s.label}</h3>
            <p className="text-2xl font-bold text-indigo-400">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/10 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Weekly Activity</h3>
        <Bar data={data} />
      </div>
    </DashboardLayout>
  );
}
import ActiveLoansTable from '@/components/dashboard/ActiveLoansTable';

// Inside <DashboardLayout> content
<ActiveLoansTable />
