import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/payments/summary'),
      api.get('/payments/revenue'),
      api.get('/reports/dashboard'),
    ]).then(([summary, revenue, dashboard]: any) => {
      setData({ summary: summary.data, revenue: revenue, dashboard: dashboard.data });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="page-header">Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${Number(data?.summary?.totalRevenue || 0).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Pending Amount</p>
          <p className="text-3xl font-bold text-amber-600">${Number(data?.summary?.pendingAmount || 0).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-3xl font-bold text-gray-900">{data?.summary?.totalTransactions || 0}</p>
        </div>
      </div>

      <div className="stat-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
        {data?.revenue && data.revenue.length > 0 ? (
          <div className="space-y-3">
            {data.revenue.slice(0, 6).map((item: any) => (
              <div key={item.month} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-20">
                  {new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{
                    width: `${Math.min(100, (Number(item.revenue) / Math.max(...data.revenue.map((r: any) => Number(r.revenue)))) * 100)}%`,
                  }} />
                </div>
                <span className="text-sm font-medium text-gray-700 w-24 text-right">
                  ${Number(item.revenue).toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 w-16 text-right">
                  {item.transactions} txns
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No revenue data yet</p>
        )}
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">{data?.dashboard?.totalTests || 0}</p>
            <p className="text-sm text-gray-500">Total Tests</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-medlab-600">{data?.dashboard?.totalPatients || 0}</p>
            <p className="text-sm text-gray-500">Active Patients</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{data?.dashboard?.testsToday || 0}</p>
            <p className="text-sm text-gray-500">Today's Tests</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-amber-600">{data?.dashboard?.totalRevenue ? `$${Number(data.dashboard.totalRevenue).toLocaleString()}` : '$0'}</p>
            <p className="text-sm text-gray-500">Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}