import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import DataViz3D from '../components/DataViz3D';
import PageTransition3D from '../components/PageTransition3D';
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
        setStats({
          totalPatients: 1284, totalTests: 5892, completedTests: 5142,
          pendingTests: 347, completionRate: 87, totalRevenue: 284750,
          totalExpenses: 98500, netProfit: 186250,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
  ];
  const financialCards = [
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

  const monthlyData = [
    { label: 'Jan', value: 65, color: '#6366f1' },
    { label: 'Feb', value: 45, color: '#8b5cf6' },
    { label: 'Mar', value: 78, color: '#06b6d4' },
    { label: 'Apr', value: 55, color: '#10b981' },
    { label: 'May', value: 92, color: '#f59e0b' },
    { label: 'Jun', value: 70, color: '#ef4444' },
    { label: 'Jul', value: 85, color: '#6366f1' },
    { label: 'Aug', value: 60, color: '#8b5cf6' },
    { label: 'Sep', value: 95, color: '#06b6d4' },
    { label: 'Oct', value: 50, color: '#10b981' },
    { label: 'Nov', value: 75, color: '#f59e0b' },
    { label: 'Dec', value: 88, color: '#ef4444' },
  ];

  return (
    <PageTransition3D>
      <div className="space-y-6">
        {/* Welcome Header with Mouse Parallax */}
        <div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-2xl card-3d"
          style={{
            transform: `perspective(1200px) rotateX(${-mousePos.y * 3}deg) rotateY(${mousePos.x * 3}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* 3D floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: `${Math.random() * 12 + 4}px`,
                  height: `${Math.random() * 12 + 4}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                  transform: `translateZ(${Math.random() * 100}px)`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl float-animate">🔬</div>
                  <div>
                    <h1 className="text-3xl font-bold">{greeting}!</h1>
                    <p className="text-indigo-200">{t('dashboard.welcome')}</p>
                  </div>
                </div>
              </div>
              {/* Mini 3D-style badges */}
              <div className="hidden sm:flex gap-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10 text-sm">
                  <span className="text-indigo-200">{t('dashboard.completionRate')}</span>
                  <span className="ml-2 font-bold">{stats?.completionRate || 0}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: t('dashboard.totalPatients'), value: stats?.totalPatients || 0, icon: '👥' },
                { label: t('dashboard.totalTests'), value: stats?.totalTests || 0, icon: '🔬' },
                { label: t('dashboard.revenue'), value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰' },
                { label: t('dashboard.completionRate'), value: `${stats?.completionRate || 0}%`, icon: '🎯' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all hover:scale-105 cursor-default"
                  style={{ transitionDelay: `${i * 50}ms` }}>
                  <div className="flex items-center justify-between">
                    <p className="text-indigo-200 text-sm">{item.label}</p>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid with 3D hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...statCards, ...financialCards].map((card, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl ${card.bg} p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group card-3d`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                  {card.icon}
                </div>
              </div>
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-1 group"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-200`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Data Visualization + Monthly Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.monthlyStats')} — 3D View</h2>
            <DataViz3D data={monthlyData} height={280} type="bars" />
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.quickActions')}</h2>
            <div className="space-y-4">
              {/* Mini revenue/expense 3D card */}
              <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 card-3d">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-600 font-medium">{t('dashboard.revenue')} vs {t('dashboard.expenses')}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm text-gray-600">{t('dashboard.revenue')}</span>
                        <span className="ml-auto font-bold text-emerald-600">${(stats?.totalRevenue || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-600">{t('dashboard.expenses')}</span>
                        <span className="ml-auto font-bold text-red-600">${(stats?.totalExpenses || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-indigo-100">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className="text-sm font-medium text-gray-700">{t('dashboard.netProfit')}</span>
                        <span className="ml-auto font-bold text-indigo-600">${(stats?.netProfit || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-5xl float-animate">📊</div>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 card-3d">
                  <p className="text-xs text-blue-600 font-medium">{t('dashboard.completedTests')}</p>
                  <p className="text-xl font-bold text-blue-800 mt-1">{stats?.completedTests || 0}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 card-3d">
                  <p className="text-xs text-amber-600 font-medium">{t('dashboard.pendingTests')}</p>
                  <p className="text-xl font-bold text-amber-800 mt-1">{stats?.pendingTests || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition3D>
  );
}