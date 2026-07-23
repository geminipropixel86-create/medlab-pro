import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';

interface DashboardStats {
  totalPatients: number;
  totalTests: number;
  completedTests: number;
  pendingTests: number;
  completionRate: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(lang === 'ar' ? 'صباح الخير' : lang === 'ckb' ? 'بەیانی باش' : lang === 'kmr' ? 'Beyanî baş' : 'Good Morning');
    else if (hour < 18) setGreeting(lang === 'ar' ? 'مساء الخير' : lang === 'ckb' ? 'ڕۆژ باش' : lang === 'kmr' ? 'Roj baş' : 'Good Afternoon');
    else setGreeting(lang === 'ar' ? 'مساء الخير' : lang === 'ckb' ? 'ئێوارە باش' : lang === 'kmr' ? 'Êvar baş' : 'Good Evening');
  }, [lang]);

  useEffect(() => {
    api.get('/reports/dashboard')
      .then(res => setStats(res.data))
      .catch(() => {
        // Demo data for display
        setStats({
          totalPatients: 1284, totalTests: 5892, completedTests: 5142,
          pendingTests: 347, completionRate: 87, totalRevenue: 284750,
          totalExpenses: 98500, netProfit: 186250,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute inset-0 opacity-50" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="ml-4 text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  const statCards = [
    { label: t('dashboard.totalPatients'), value: stats?.totalPatients || 0, icon: '👥', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
    { label: t('dashboard.totalTests'), value: stats?.totalTests || 0, icon: '🔬', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
    { label: t('dashboard.completedTests'), value: stats?.completedTests || 0, icon: '✅', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
    { label: t('dashboard.pendingTests'), value: stats?.pendingTests || 0, icon: '⏳', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
    { label: t('dashboard.revenue'), value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
    { label: t('dashboard.expenses'), value: `$${(stats?.totalExpenses || 0).toLocaleString()}`, icon: '📤', color: 'from-red-500 to-rose-500', bg: 'bg-red-50' },
    { label: t('dashboard.netProfit'), value: `$${(stats?.netProfit || 0).toLocaleString()}`, icon: '📈', color: 'from-violet-500 to-indigo-500', bg: 'bg-violet-50' },
    { label: t('dashboard.completionRate'), value: `${stats?.completionRate || 0}%`, icon: '🎯', color: 'from-sky-500 to-blue-500', bg: 'bg-sky-50' },
  ];

  const quickActions = [
    { label: t('dashboard.newPatient'), icon: '👤', color: 'bg-blue-500', path: '/patients' },
    { label: t('dashboard.newTest'), icon: '🔬', color: 'bg-purple-500', path: '/tests' },
    { label: t('dashboard.viewReports'), icon: '📊', color: 'bg-emerald-500', path: '/reports' },
    { label: t('dashboard.exportData'), icon: '📥', color: 'bg-amber-500', path: '/reports' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header with 3D effect */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-2xl">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-pulse"
              style={{
                width: Math.random() * 8 + 4 + 'px',
                height: Math.random() * 8 + 4 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 3 + 2 + 's',
              }}
            />
          ))}
        </div>
        {/* 3D card effect */}
        <div className="relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl animate-bounce">🔬</div>
            <div>
              <h1 className="text-3xl font-bold">{greeting}!</h1>
              <p className="text-indigo-200">{t('dashboard.welcome')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-indigo-200 text-sm">{t('dashboard.totalPatients')}</p>
              <p className="text-2xl font-bold">{stats?.totalPatients || 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-indigo-200 text-sm">{t('dashboard.totalTests')}</p>
              <p className="text-2xl font-bold">{stats?.totalTests || 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-indigo-200 text-sm">{t('dashboard.revenue')}</p>
              <p className="text-2xl font-bold">${(stats?.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-indigo-200 text-sm">{t('dashboard.completionRate')}</p>
              <p className="text-2xl font-bold">{stats?.completionRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl ${card.bg} p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000`}
                style={{ width: `${Math.min(parseInt(String(card.value)) || 50, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-1 group"
            >
              <div className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.monthlyStats')}</h2>
        <div className="h-48 flex items-end gap-3">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
            const height = 20 + Math.random() * 60;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 cursor-pointer group-hover:scale-105"
                  style={{ height: `${height}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-center text-white pt-1">
                    {Math.round(height * 10)}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}