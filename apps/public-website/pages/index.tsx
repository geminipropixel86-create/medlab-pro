import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getLang } from './_app';
import translations from '../i18n/translations';

const demoPackages = [
  { id: '1', name: 'Basic Health Checkup', nameAr: 'فحص الصحة الأساسي', nameCkb: 'پشکنینی تەندروستی بنەڕەتی', nameKmr: 'Kontrola Tenduristiyê ya Bingeha',
    description: 'Essential blood tests for general health screening', descriptionAr: 'فحوصات الدم الأساسية للفحص الصحي العام',
    descriptionCkb: 'پشکنینی خوێنی بنەڕەتی بۆ پشکنینی تەندروستی گشتی', descriptionKmr: 'Testên xwînê yên bingehîn ji bo kontrola tenduristiya giştî',
    packagePrice: 49, originalTotalPrice: 75, savingsPercentage: 35, badge: 'popular',
    highlights: ['Includes CBC & Lipid Profile', 'Results in 24 hours', 'Free consultation'],
    highlightsAr: ['يشمل صورة الدم الكاملة ودهون الدم', 'النتائج خلال 24 ساعة', 'استشارة مجانية'],
    highlightsCkb: ['CBC و پڕۆفایلی چەوری دەگرێتەوە', 'ئەنجام لە 24 کاتژمێردا', 'ڕاوێژی بەخۆڕایی'],
    highlightsKmr: ['CBC & Profîla Rûnê dihewîne', 'Encam di 24 saetan de', 'Şêwirdariya belaş'],
    includedTests: [
      { testName: 'Complete Blood Count', testNameAr: 'صورة الدم الكاملة', testNameCkb: 'ژماردنی تەواوی خوێن', testNameKmr: 'Hejmartina Tevahiya Xwînê', originalPrice: 25 },
      { testName: 'Lipid Profile', testNameAr: 'دهون الدم', testNameCkb: 'پڕۆفایلی چەوری', testNameKmr: 'Profîla Rûnê', originalPrice: 30 },
      { testName: 'Blood Glucose', testNameAr: 'سكر الدم', testNameCkb: 'شەکری خوێن', testNameKmr: 'Şekira Xwînê', originalPrice: 20 },
    ] },
  { id: '2', name: 'Comprehensive Wellness', nameAr: 'العافية الشاملة', nameCkb: 'تەندروستی گشتی', nameKmr: 'Tenduristiya Berfireh',
    description: 'Full panel with thyroid, liver, and kidney function tests', descriptionAr: 'لوحة كاملة مع اختبارات الغدة الدرقية والكبد والكلى',
    descriptionCkb: 'پانێلی تەواو لەگەڵ پشکنینی تایرۆید و جگەر و گورچیلە', descriptionKmr: 'Panela tevahî bi testên tîroîd, kezeb û gurçikan',
    packagePrice: 89, originalTotalPrice: 130, savingsPercentage: 32, badge: 'best-value',
    highlights: ['Thyroid & Liver Function', 'Kidney Profile Included', 'Vitamin D Check'],
    highlightsAr: ['وظائف الغدة الدرقية والكبد', 'يشمل وظائف الكلى', 'فحص فيتامين د'],
    highlightsCkb: ['کارکردنی تایرۆید و جگەر', 'پڕۆفایلی گورچیلە دەگرێتەوە', 'پشکنینی ڤیتامین D'],
    highlightsKmr: ['Fonksiyona Tîroîd û Kezebê', 'Profîla Gurçikan dihewîne', 'Kontrola Vîtamîn D'],
    includedTests: [
      { testName: 'Thyroid Panel', testNameAr: 'لوحة الغدة الدرقية', testNameCkb: 'پانێلی تایرۆید', testNameKmr: 'Panela Tîroîdê', originalPrice: 40 },
      { testName: 'Liver Function', testNameAr: 'وظائف الكبد', testNameCkb: 'کارکردنی جگەر', testNameKmr: 'Fonksiyona Kezebê', originalPrice: 35 },
      { testName: 'Kidney Function', testNameAr: 'وظائف الكلى', testNameCkb: 'کارکردنی گورچیلە', testNameKmr: 'Fonksiyona Gurçikan', originalPrice: 30 },
      { testName: 'Vitamin D', testNameAr: 'فيتامين د', testNameCkb: 'ڤیتامین D', testNameKmr: 'Vîtamîn D', originalPrice: 25 },
    ] },
  { id: '3', name: 'Heart Health Package', nameAr: 'باقة صحة القلب', nameCkb: 'پاکێجی تەندروستی دڵ', nameKmr: 'Pakêta Tenduristiya Dil',
    description: 'Cardiac markers and lipid assessment for heart health monitoring', descriptionAr: 'علامات القلب وتقييم الدهون لمراقبة صحة القلب',
    descriptionCkb: 'نیشانەکانی دڵ و هەڵسەنگاندنی چەوری بۆ چاودێری تەندروستی دڵ', descriptionKmr: 'Nîşanên dil û nirxandina rûnê ji bo çavdêriya tenduristiya dil',
    packagePrice: 129, originalTotalPrice: 185, savingsPercentage: 30, badge: '',
    highlights: ['Cardiac Enzyme Markers', 'Advanced Lipid Panel', 'C-Reactive Protein'],
    highlightsAr: ['علامات إنزيمات القلب', 'لوحة دهون متقدمة', 'بروتين سي التفاعلي'],
    highlightsCkb: ['نیشانەکانی ئەنزیمی دڵ', 'پانێلی چەوری پێشکەوتوو', 'پڕۆتینی C'],
    highlightsKmr: ['Nîşanên Enzîma Dil', 'Panela Rûnê ya Pêşketî', 'Proteîna C-Reaktîv'],
    includedTests: [
      { testName: 'Cardiac Enzymes', testNameAr: 'إنزيمات القلب', testNameCkb: 'ئەنزیمەکانی دڵ', testNameKmr: 'Enzîmên Dil', originalPrice: 60 },
      { testName: 'Advanced Lipid Panel', testNameAr: 'لوحة دهون متقدمة', testNameCkb: 'پانێلی چەوری پێشکەوتوو', testNameKmr: 'Panela Rûnê ya Pêşketî', originalPrice: 45 },
      { testName: 'CRP Test', testNameAr: 'اختبار CRP', testNameCkb: 'پشکنینی CRP', testNameKmr: 'Testa CRP', originalPrice: 35 },
      { testName: 'ECG', testNameAr: 'تخطيط القلب', testNameCkb: 'تۆمارکردنی دڵ', testNameKmr: 'Kardiyogram', originalPrice: 45 },
    ] },
];

export default function Home() {
  const [lang, setLang] = useState<'en' | 'ar' | 'ckb' | 'kmr'>('en');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setLang(getLang());
    const interval = setInterval(() => setLang(getLang()), 200);
    return () => clearInterval(interval);
  }, []);

  const t = (key: string) => {
    const keys = key.split('.');
    let v: any = (translations as any)[lang];
    for (const k of keys) {
      if (v && typeof v === 'object' && k in v) v = v[k];
      else return key;
    }
    return typeof v === 'string' ? v : key;
  };

  const displayedPackages = showAll ? demoPackages : demoPackages.slice(0, 3);

  const getPkgField = (pkg: any, field: string, fieldAr: string, fieldCkb: string, fieldKmr: string) => {
    if (lang === 'ckb' && pkg[fieldCkb]) return pkg[fieldCkb];
    if (lang === 'kmr' && pkg[fieldKmr]) return pkg[fieldKmr];
    if (lang === 'ar' && pkg[fieldAr]) return pkg[fieldAr];
    return pkg[field];
  };

  return (
    <Layout>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('desc')} />
      </Head>

      {/* Hero Section with 3D Effect */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white/5 animate-pulse"
              style={{
                width: Math.random() * 20 + 4 + 'px', height: Math.random() * 20 + 4 + 'px',
                left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's', animationDuration: Math.random() * 5 + 3 + 's',
              }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="text-6xl mb-6 animate-bounce">🔬</div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t('hero.title')} <span className="text-yellow-300">{t('hero.accent')}</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mt-6 max-w-2xl">
              {t('hero.desc')}
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <Link href="/contact" className="px-8 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-200">
                {t('hero.cta')}
              </Link>
              <Link href="/services" className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-all">
                {t('hero.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('features.title')}</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{t('features.desc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {(() => {
              const items = (translations as any)[lang]?.features?.items || (translations as any)['en'].features.items;
              return items.map((f: any, i: number) => (
                <div key={i} className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                    {['👥', '🔬', '💰', '🌐', '📦', '📧'][i]}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'stats.title', value: '500+' },
              { label: 'stats.title2', value: '50K+' },
              { label: 'stats.title3', value: '1M+' },
              { label: 'stats.title4', value: '15+' },
            ].map((s, i) => (
              <div key={i} className="text-white">
                <p className="text-4xl md:text-5xl font-bold">{s.value}</p>
                <p className="text-indigo-200 mt-2">{t(s.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('packages.title')}</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{t('packages.desc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {displayedPackages.map((pkg) => (
              <div key={pkg.id} className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                pkg.badge === 'popular' ? 'border-indigo-300 ring-2 ring-indigo-400' : pkg.badge === 'best-value' ? 'border-emerald-300 ring-2 ring-emerald-400' : 'border-gray-100'
              }`}>
                {pkg.badge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    pkg.badge === 'popular' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}>
                    {pkg.badge === 'popular' ? t('packages.popular') : t('packages.bestValue')}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">{getPkgField(pkg, 'name', 'nameAr', 'nameCkb', 'nameKmr')}</h3>
                  <p className="text-sm text-gray-500 mt-2">{getPkgField(pkg, 'description', 'descriptionAr', 'descriptionCkb', 'descriptionKmr')}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">${pkg.packagePrice}</span>
                    <span className="text-lg text-gray-400 line-through">${pkg.originalTotalPrice}</span>
                    <span className="text-sm font-bold text-emerald-600">{t('packages.saving', '{percent}').replace('{percent}', String(pkg.savingsPercentage))}</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-600">{t('packages.includes')}:</p>
                    {pkg.includedTests.map((test: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        <span>{getPkgField(test, 'testName', 'testNameAr', 'testNameCkb', 'testNameKmr')}</span>
                        <span className="ml-auto text-gray-400">${test.originalPrice}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {(lang === 'ckb' ? pkg.highlightsCkb : lang === 'kmr' ? pkg.highlightsKmr : lang === 'ar' ? pkg.highlightsAr : pkg.highlights).map((h: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500 mb-1"><span>✦</span> {h}</div>
                    ))}
                  </div>
                  <button className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all">
                    {t('packages.buyNow')}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {demoPackages.length > 3 && (
            <div className="text-center mt-8">
              <button onClick={() => setShowAll(!showAll)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all">
                {showAll ? 'Show Less' : t('packages.viewAllLink')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('cta.title')}</h2>
          <p className="text-gray-600 mt-4 text-lg">{t('cta.desc')}</p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Link href="/contact" className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-200">
              {t('cta.startFree')}
            </Link>
            <Link href="/services" className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-indigo-300 hover:text-indigo-600 transition-all">
              {t('cta.viewPricing')}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}