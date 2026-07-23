import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

interface DashboardStats {
  totalTests: number;
  totalPatients: number;
  totalRevenue: number;
  testsToday: number;
  monthlyTrend: Array<{ month: string; tests: string }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/dashboard').then((res: any) => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  const cards = [
    { label: 'Total Patients', value: stats?.totalPatients ?? 0, href: '/patients', color: 'bg-blue-500', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Total Tests', value: stats?.totalTests ?? 0, href: '/tests', color: 'bg-green-500', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: "Today's Tests", value: stats?.testsToday ?? 0, href: '/tests', color: 'bg-purple-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Revenue', value: `$${Number(stats?.totalRevenue ?? 0).toLocaleString()}`, href: '/reports', color: 'bg-amber-500', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link key={card.label} to={card.href} className="stat-card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="stat-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Test Trend</h2>
          {stats?.monthlyTrend && stats.monthlyTrend.length > 0 ? (
            <div className="space-y-3">
              {stats.monthlyTrend.slice(0, 6).map((item) => (
                <div key={item.month} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-20">{new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (Number(item.tests) / Math.max(...stats.monthlyTrend.map((t) => Number(t.tests)))) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-10 text-right">{item.tests}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No data yet</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="stat-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/patients" className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <p className="font-medium text-blue-700 text-sm">New Patient</p>
              <p className="text-blue-500 text-xs mt-1">Register a patient</p>
            </Link>
            <Link to="/tests" className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <p className="font-medium text-green-700 text-sm">New Test</p>
              <p className="text-green-500 text-xs mt-1">Order lab test</p>
            </Link>
            <Link to="/results" className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <p className="font-medium text-purple-700 text-sm">Enter Results</p>
              <p className="text-purple-500 text-xs mt-1">Add test results</p>
            </Link>
            <Link to="/pricing" className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
              <p className="font-medium text-amber-700 text-sm">Pricing</p>
              <p className="text-amber-500 text-xs mt-1">Manage price list</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}