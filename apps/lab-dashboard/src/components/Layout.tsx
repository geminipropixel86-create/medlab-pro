import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLanguage, Language } from '../i18n/LanguageContext';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
  { code: 'ckb', label: 'CKB', flag: '🏳️' },
  { code: 'kmr', label: 'KMR', flag: '🏳️' },
];

const navItems = [
  { path: '/', label: 'nav.dashboard', icon: '📊' },
  { path: '/patients', label: 'nav.patients', icon: '👥' },
  { path: '/tests', label: 'nav.tests', icon: '🔬' },
  { path: '/results', label: 'nav.results', icon: '📋' },
  { path: '/pricing', label: 'nav.pricing', icon: '💰' },
  { path: '/packages', label: 'nav.packages', icon: '📦' },
  { path: '/news', label: 'nav.news', icon: '📢' },
  { path: '/reports', label: 'nav.reports', icon: '📈' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { t, lang, setLang, dir } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" dir={dir}>
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex-shrink-0
        shadow-2xl
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="text-3xl animate-pulse">🔬</div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t('app.title')}</h1>
            <p className="text-xs text-indigo-300">{t('app.subtitle')}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg shadow-indigo-500/20 border border-white/10'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{t(item.label)}</span>
            </NavLink>
          ))}
        </nav>

        {/* User & Language */}
        <div className="border-t border-white/10 p-4 space-y-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
            >
              <span>{languages.find(l => l.code === lang)?.flag}</span>
              <span>{languages.find(l => l.code === lang)?.label}</span>
              <span className="ml-auto text-xs opacity-70">▼</span>
            </button>
            {langDropdownOpen && (
              <div className="absolute bottom-full mb-1 left-0 right-0 bg-indigo-800 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                      lang === l.code ? 'bg-white/20 text-white' : 'text-indigo-200 hover:bg-white/10'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                    <span className="text-xs opacity-60 ml-1">{t(`common.lang${l.code === 'en' ? 'En' : l.code === 'ar' ? 'Ar' : l.code === 'ckb' ? 'Ckb' : 'Kmr'}`)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-indigo-300 hover:text-white transition-colors text-lg"
              title={t('nav.logout')}
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              ☰
            </button>
            <h1 className="text-lg font-bold text-indigo-900">{t('app.title')}</h1>
            <div className="flex items-center gap-2">
              {languages.slice(0, 2).map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`text-xs px-2 py-1 rounded ${
                    lang === l.code ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}