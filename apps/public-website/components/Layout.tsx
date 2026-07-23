import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import translations, { Lang } from '../i18n/translations';
import { getLang, setGlobalLang } from '../pages/_app';

const langList: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ar', label: 'العربية', native: 'العربية' },
  { code: 'ckb', label: 'کوردی', native: 'کوردی سۆرانی' },
  { code: 'kmr', label: 'Kurmancî', native: 'Kurmancî' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLangState] = useState<Lang>('en');
  const router = useRouter();

  useEffect(() => {
    setLangState(getLang());
  }, []);

  const switchLang = (code: Lang) => {
    setGlobalLang(code);
    setLangState(code);
    setLangOpen(false);
    localStorage.setItem('medlab-website-lang', code);
    document.documentElement.lang = code;
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let v: any = translations[lang];
    for (const k of keys) {
      if (v && typeof v === 'object' && k in v) v = v[k];
      else {
        v = (translations['en'] as any)[key];
        break;
      }
    }
    return typeof v === 'string' ? v : key;
  };

  const navLinks = [
    { href: '/', label: 'nav.home' },
    { href: '/about', label: 'nav.about' },
    { href: '/services', label: 'nav.services' },
    { href: '/#packages', label: 'nav.packages' },
    { href: '/contact', label: 'nav.contact' },
  ];

  const currentLang = langList.find(l => l.code === lang);

  return (
    <div className="min-h-screen flex flex-col" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-lg">🔬</span>
              </div>
              <span className="font-bold text-xl text-gray-900">MedLab <span className="text-indigo-600">Pro</span></span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    router.pathname === link.href ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t(link.label)}
                </Link>
              ))}

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span>{currentLang?.label}</span>
                  <span className="text-xs">▼</span>
                </button>
                {langOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[180px] z-50">
                    {langList.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => switchLang(l.code)}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                          lang === l.code ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{l.code === 'en' ? '🇬🇧' : l.code === 'ar' ? '🇸🇦' : '🏳️'}</span>
                        <span>{l.native}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/contact" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all">
                {t('nav.getStarted')}
              </Link>
            </nav>

            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="block text-sm font-medium text-gray-600 hover:text-gray-900"
                  onClick={() => setMenuOpen(false)}>
                  {t(link.label)}
                </Link>
              ))}
              <div className="flex gap-2 pt-2 border-t">
                {langList.map((l) => (
                  <button key={l.code} onClick={() => { switchLang(l.code); setMenuOpen(false); }}
                    className={`px-3 py-1 rounded-lg text-xs ${lang === l.code ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                    {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
              <Link href="/contact" className="block text-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium" onClick={() => setMenuOpen(false)}>
                {t('nav.getStarted')}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">🔬</span>
                </div>
                <span className="font-bold text-xl text-white">MedLab <span className="text-indigo-400">Pro</span></span>
              </div>
              <p className="text-sm leading-relaxed">{t('footer.desc')}</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">{t('footer.quickLinks')}</h3>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block hover:text-white">{t('nav.home')}</Link>
                <Link href="/about" className="block hover:text-white">{t('nav.about')}</Link>
                <Link href="/services" className="block hover:text-white">{t('nav.services')}</Link>
                <Link href="/contact" className="block hover:text-white">{t('nav.contact')}</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">{t('footer.contact')}</h3>
              <div className="space-y-2 text-sm">
                <p>hello@medlabpro.com</p>
                <p>+1 (555) 123-4567</p>
                <p>123 Health St, Medical District</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            &copy; {new Date().getFullYear()} MedLab Pro. {t('footer.rights')}
          </div>
        </div>
      </footer>
    </div>
  );
}