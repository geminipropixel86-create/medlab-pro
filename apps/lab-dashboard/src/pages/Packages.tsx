import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../lib/api';

interface TestPackage {
  id: string;
  name: string; nameAr: string; nameCkb: string; nameKmr: string;
  description: string; descriptionAr: string; descriptionCkb: string; descriptionKmr: string;
  packagePrice: number;
  originalTotalPrice: number;
  savingsPercentage: number;
  includedTests: any[];
  highlights: string[]; highlightsAr: string[]; highlightsCkb: string[]; highlightsKmr: string[];
  badge: string;
  isActive: boolean;
  sortOrder: number;
}

export default function Packages() {
  const { t, lang } = useLanguage();
  const [packages, setPackages] = useState<TestPackage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({});

  const noPackages = packages.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('packages.title')}</h1>
          <p className="text-gray-500 mt-1">{t('pricing.activePackages')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all font-medium"
        >
          {t('pricing.addPackage')}
        </button>
      </div>

      {/* Package Cards */}
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
              className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                pkg.badge === 'popular' ? 'border-indigo-300 ring-2 ring-indigo-400' : 'border-gray-100'
              }`}
            >
              {pkg.badge && (
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  pkg.badge === 'popular' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}>
                  {pkg.badge === 'popular' ? t('packages.popular') : t('packages.bestValue')}
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {lang === 'ckb' && pkg.nameCkb ? pkg.nameCkb : lang === 'kmr' && pkg.nameKmr ? pkg.nameKmr : lang === 'ar' && pkg.nameAr ? pkg.nameAr : pkg.name}
                </h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {lang === 'ckb' && pkg.descriptionCkb ? pkg.descriptionCkb : lang === 'kmr' && pkg.descriptionKmr ? pkg.descriptionKmr : lang === 'ar' && pkg.descriptionAr ? pkg.descriptionAr : pkg.description}
                </p>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-800">${pkg.packagePrice}</span>
                  <span className="text-sm text-gray-400 line-through">${pkg.originalTotalPrice}</span>
                  <span className="text-sm font-bold text-emerald-600">{t('packages.saving', { percent: pkg.savingsPercentage })}</span>
                </div>

                {/* Tests included */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-600">{t('packages.includes')}:</p>
                  {pkg.includedTests?.map((test: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      <span>{lang === 'ckb' && test.testNameCkb ? test.testNameCkb : lang === 'kmr' && test.testNameKmr ? test.testNameKmr : lang === 'ar' && test.testNameAr ? test.testNameAr : test.testName}</span>
                      <span className="ml-auto text-gray-400">${test.originalPrice}</span>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                {pkg.highlights && pkg.highlights.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {(lang === 'ckb' ? pkg.highlightsCkb : lang === 'kmr' ? pkg.highlightsKmr : lang === 'ar' ? pkg.highlightsAr : pkg.highlights)?.map((h: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <span>✦</span> {h}
                      </div>
                    ))}
                  </div>
                )}

                <button className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all">
                  {t('packages.buyNow')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
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
  );
}