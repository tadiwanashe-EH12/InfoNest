import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useQuery } from 'react-query';
import { getDashboardStats } from '../../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend);

export const StatsOverview = () => {
  const { data, isLoading, error } = useQuery('dashboardStats', getDashboardStats);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading stats</div>;

  const chartData = {
    labels: ['Available', 'Borrowed', 'Lost'],
    datasets: [
      {
        label: 'Book Status',
        data: [data.availableBooks, data.borrowedBooks, data.lostBooks],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-3">
        <h3 className="text-lg font-semibold mb-4">Book Status Distribution</h3>
        <div className="h-64">
          <Doughnut data={chartData} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Total Books</p>
            <p className="text-2xl font-bold">{data.totalBooks}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Members</p>
            <p className="text-2xl font-bold">{data.activeMembers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Overdue Loans</p>
            <p className="text-2xl font-bold text-red-500">{data.overdueLoans}</p>
          </div>
        </div>
      </div>
    </div>
  );
};