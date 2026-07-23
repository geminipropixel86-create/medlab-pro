import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';
import Package3DCard from '../components/Package3DCard';
import PageTransition3D from '../components/PageTransition3D';

const demoPackages = [
  { id: '1', name: 'Basic Health Checkup', nameAr: 'فحص الصحة الأساسي', nameCkb: 'پشکنینی تەندروستی بنەڕەتی', nameKmr: 'Kontrola Tenduristiyê ya Bingeha',
    description: 'Essential blood tests for general health screening', packagePrice: 49, originalTotalPrice: 75, savingsPercentage: 35, badge: 'popular',
    color: '#6366f1', accentColor: '#8b5cf6',
    includedTests: [
      { testName: 'Complete Blood Count', testNameAr: 'صورة الدم الكاملة', testNameCkb: 'ژماردنی تەواوی خوێن', testNameKmr: 'Hejmartina Tevahiya Xwînê', originalPrice: 25 },
      { testName: 'Lipid Profile', testNameAr: 'دهون الدم', testNameCkb: 'پڕۆفایلی چەوری', testNameKmr: 'Profîla Rûnê', originalPrice: 30 },
      { testName: 'Blood Glucose', testNameAr: 'سكر الدم', testNameCkb: 'شەکری خوێن', testNameKmr: 'Şekira Xwînê', originalPrice: 20 },
    ] },
  { id: '2', name: 'Comprehensive Wellness', nameAr: 'العافية الشاملة', nameCkb: 'تەندروستی گشتی', nameKmr: 'Tenduristiya Berfireh',
    description: 'Full panel with thyroid, liver, and kidney function tests', packagePrice: 89, originalTotalPrice: 130, savingsPercentage: 32, badge: 'best-value',
    color: '#10b981', accentColor: '#059669',
    includedTests: [
      { testName: 'Thyroid Panel', testNameAr: 'لوحة الغدة الدرقية', testNameCkb: 'پانێلی تایرۆید', testNameKmr: 'Panela Tîroîdê', originalPrice: 40 },
      { testName: 'Liver Function', testNameAr: 'وظائف الكبد', testNameCkb: 'کارکردنی جگەر', testNameKmr: 'Fonksiyona Kezebê', originalPrice: 35 },
      { testName: 'Kidney Function', testNameAr: 'وظائف الكلى', testNameCkb: 'کارکردنی گورچیلە', testNameKmr: 'Fonksiyona Gurçikan', originalPrice: 30 },
      { testName: 'Vitamin D', testNameAr: 'فيتامين د', testNameCkb: 'ڤیتامین D', testNameKmr: 'Vîtamîn D', originalPrice: 25 },
    ] },
  { id: '3', name: 'Heart Health Package', nameAr: 'باقة صحة القلب', nameCkb: 'پاکێجی تەندروستی دڵ', nameKmr: 'Pakêta Tenduristiya Dil',
    description: 'Cardiac markers and lipid assessment for heart health monitoring', packagePrice: 129, originalTotalPrice: 185, savingsPercentage: 30, badge: '',
    color: '#f43f5e', accentColor: '#e11d48',
    includedTests: [
      { testName: 'Cardiac Enzymes', testNameAr: 'إنزيمات القلب', testNameCkb: 'ئەنزیمەکانی دڵ', testNameKmr: 'Enzîmên Dil', originalPrice: 60 },
      { testName: 'Advanced Lipid Panel', testNameAr: 'لوحة دهون متقدمة', testNameCkb: 'پانێلی چەوری پێشکەوتوو', testNameKmr: 'Panela Rûnê ya Pêşketî', originalPrice: 45 },
      { testName: 'CRP Test', testNameAr: 'اختبار CRP', testNameCkb: 'پشکنینی CRP', testNameKmr: 'Testa CRP', originalPrice: 35 },
      { testName: 'ECG', testNameAr: 'تخطيط القلب', testNameCkb: 'تۆمارکردنی دڵ', testNameKmr: 'Kardiyogram', originalPrice: 45 },
    ] },
];

export default function Packages() {
  const { t, lang } = useLanguage();
  const [packages, setPackages] = useState<any[]>(demoPackages);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({});

  const noPackages = packages.length === 0;

  const getPkgField = (pkg: any, field: string, fieldAr: string, fieldCkb: string, fieldKmr: string) => {
    if (lang === 'ckb' && pkg[fieldCkb]) return pkg[fieldCkb];
    if (lang === 'kmr' && pkg[fieldKmr]) return pkg[fieldKmr];
    if (lang === 'ar' && pkg[fieldAr]) return pkg[fieldAr];
    return pkg[field];
  };

  return (
    <PageTransition3D>
      <div className="space-y-6">
        {/* Header with 3D-ish gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 text-white">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white/5"
                style={{
                  width: `${Math.random() * 8 + 4}px`, height: `${Math.random() * 8 + 4}px`,
                  left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                }} />
            ))}
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t('packages.title')}</h1>
              <p className="text-indigo-200 mt-1">{t('pricing.activePackages')}</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-white text-indigo-700 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all font-medium"
            >
              {t('pricing.addPackage')}
            </button>
          </div>
        </div>

        {/* Package Cards with 3D Models */}
        {noPackages ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">{t('packages.noPackages')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  pkg.badge === 'popular' ? 'border-indigo-300 ring-2 ring-indigo-400' : pkg.badge === 'best-value' ? 'border-emerald-300 ring-2 ring-emerald-400' : 'border-gray-100'
                }`}
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                {pkg.badge && (
                  <div className={`absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    pkg.badge === 'popular' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}>
                    {pkg.badge === 'popular' ? t('packages.popular') : t('packages.bestValue')}
                  </div>
                )}

                {/* 3D Model */}
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50/50">
                  <Package3DCard
                    name={pkg.name}
                    price={pkg.packagePrice}
                    color={pkg.color}
                    accentColor={pkg.accentColor}
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {getPkgField(pkg, 'name', 'nameAr', 'nameCkb', 'nameKmr')}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {getPkgField(pkg, 'description', 'nameAr', 'nameCkb', 'nameKmr')}
                  </p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-800">${pkg.packagePrice}</span>
                    <span className="text-sm text-gray-400 line-through">${pkg.originalTotalPrice}</span>
                    <span className="text-sm font-bold text-emerald-600">{t('packages.saving', { percent: pkg.savingsPercentage })}</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-600">{t('packages.includes')}:</p>
                    {pkg.includedTests?.map((test: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        <span>{getPkgField(test, 'testName', 'testNameAr', 'testNameCkb', 'testNameKmr')}</span>
                        <span className="ml-auto text-gray-400">${test.originalPrice}</span>
                      </div>
                    ))}
                  </div>

                  <button className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    {t('packages.buyNow')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for adding packages */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t('pricing.addPackage')}</h2>
              <div className="space-y-3">
                <input placeholder={`${t('common.save')} (EN)`} className="w-full px-4 py-2 border rounded-lg" onChange={e => setForm({...form, name: e.target.value})} />
                <input placeholder={`${t('common.save')} (AR)`} className="w-full px-4 py-2 border rounded-lg" onChange={e => setForm({...form, nameAr: e.target.value})} />
                <input placeholder={`${t('common.save')} (CKB)`} className="w-full px-4 py-2 border rounded-lg" onChange={e => setForm({...form, nameCkb: e.target.value})} />
                <input placeholder={`${t('common.save')} (KMR)`} className="w-full px-4 py-2 border rounded-lg" onChange={e => setForm({...form, nameKmr: e.target.value})} />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50">{t('common.cancel')}</button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">{t('common.save')}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition3D>
  );
}