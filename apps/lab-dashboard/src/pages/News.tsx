import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const categoryColors: Record<string, string> = {
  general: 'bg-blue-100 text-blue-700',
  offer: 'bg-green-100 text-green-700',
  update: 'bg-purple-100 text-purple-700',
  'health-tip': 'bg-amber-100 text-amber-700',
};

export default function News() {
  const { t, lang } = useLanguage();
  const [articles] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('news.title')}</h1>
          <p className="text-gray-500 mt-1">{t('news.featured')}</p>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
          {t('news.addNew')}
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="text-6xl mb-4">📢</div>
          <p className="text-gray-500 text-lg">{t('news.noNews')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
              {article.imageUrl && (
                <img src={article.imageUrl} alt="" className="w-full h-48 object-cover" />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}>
                    {t(`news.${article.category}`)}
                  </span>
                  {article.isFeatured && <span className="text-xs text-amber-600">★ {t('news.featured')}</span>}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {lang === 'ckb' && article.titleCkb ? article.titleCkb : lang === 'kmr' && article.titleKmr ? article.titleKmr : lang === 'ar' && article.titleAr ? article.titleAr : article.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {lang === 'ckb' && article.contentCkb ? article.contentCkb : lang === 'kmr' && article.contentKmr ? article.contentKmr : lang === 'ar' && article.contentAr ? article.contentAr : article.content}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <span>{new Date(article.publishDate || article.createdAt).toLocaleDateString()}</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">{t('packages.viewDetails')} →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}