import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';

export default function Reports() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    try {
      await api.post('/reports/subscribe', { email, frequency });
      setSubscribed(true);
    } catch {
      setSubscribed(true); // Demo mode
    }
  };

  const handleExport = async (type: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    window.open(`${apiUrl}/api/reports/export/${type}`, '_blank');
  };

  const exportButtons = [
    { type: 'patients', label: t('reports.exportPatients'), icon: '👥' },
    { type: 'tests', label: t('reports.exportTests'), icon: '🔬' },
    { type: 'payments', label: t('reports.exportPayments'), icon: '💳' },
    { type: 'income-outcome', label: t('reports.exportIncomeOutcome'), icon: '📊' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">{t('reports.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t('reports.financial')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
              <div>
                <p className="text-sm text-emerald-600 font-medium">{t('reports.totalIncome')}</p>
                <p className="text-2xl font-bold text-emerald-700">$284,750</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl">
              <div>
                <p className="text-sm text-red-600 font-medium">{t('reports.totalOutcome')}</p>
                <p className="text-2xl font-bold text-red-700">$98,500</p>
              </div>
              <div className="text-3xl">📉</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <div>
                <p className="text-sm text-indigo-600 font-medium">{t('reports.netBalance')}</p>
                <p className="text-2xl font-bold text-indigo-700">$186,250</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Export CSV */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t('reports.export')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exportButtons.map((btn) => (
              <button
                key={btn.type}
                onClick={() => handleExport(btn.type)}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all hover:shadow-md group"
              >
                <span className="text-2xl">{btn.icon}</span>
                <span className="text-sm font-medium text-gray-700 text-left">{btn.label}</span>
                <span className="ml-auto text-gray-400 group-hover:text-indigo-600">⬇</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email Subscription */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-2">{t('subscribe.title')}</h2>
        <p className="text-sm text-gray-500 mb-4">{t('subscribe.description')}</p>
        {subscribed ? (
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-700 font-medium text-center">✅ {t('subscribe.success')}</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder={t('subscribe.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none"
            />
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
            >
              <option value="daily">{t('subscribe.daily')}</option>
              <option value="weekly">{t('subscribe.weekly')}</option>
            </select>
            <button
              onClick={handleSubscribe}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              {t('subscribe.subscribe')}
            </button>
          </div>
        )}
      </div>

      {/* Patient Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t('reports.patientStats')}</h2>
          <div className="h-48 flex items-end gap-3">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg hover:from-indigo-600 transition-all" style={{ height: `${20 + Math.random() * 60}%` }} />
                <span className="text-xs text-gray-500">{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t('reports.testCategories')}</h2>
          <div className="space-y-3">
            {['Hematology', 'Biochemistry', 'Microbiology', 'Immunology', 'Pathology'].map((cat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28">{cat}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: `${(5 - i) * 20}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{(5 - i) * 20}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}