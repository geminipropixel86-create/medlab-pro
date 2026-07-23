import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function Results() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [resultData, setResultData] = useState({ summary: '', interpretation: '', parameters: '' });

  const fetchResults = async () => {
    try {
      const res: any = await api.get('/tests', { params: { status: 'completed', limit: 50 } });
      setResults(res.data || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResults(); }, []);

  const openEntry = async (test: any) => {
    setSelectedTest(test);
    setResultData({ summary: '', interpretation: '', parameters: '' });
    try {
      const existing: any = await api.get(`/results/test/${test.id}`);
      if (existing) {
        setResultData({
          summary: existing.summary || '',
          interpretation: existing.interpretation || '',
          parameters: JSON.stringify(existing.parameters || [], null, 2),
        });
      }
    } catch { /* no existing result */ }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedTest) return;
    try {
      const params = resultData.parameters ? JSON.parse(resultData.parameters) : [];
      await api.post('/results', {
        testId: selectedTest.id,
        summary: resultData.summary,
        interpretation: resultData.interpretation,
        parameters: params,
      });
      toast.success('Results saved');
      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.message?.[0] || 'Failed to save');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="page-header">Test Results Entry</h1>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Test #</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Test Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : results.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No tests completed yet</td></tr>
            ) : results.map((t: any) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-primary-600">{t.testNumber}</td>
                <td className="px-4 py-3 text-sm font-medium">{t.testName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{t.patient?.firstName} {t.patient?.lastName}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openEntry(t)} className="text-primary-600 text-sm hover:underline">
                    Enter Results
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedTest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-1">Results: {selectedTest.testName}</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedTest.patient?.firstName} {selectedTest.patient?.lastName}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parameters (JSON)</label>
                <textarea className="input-field font-mono text-xs" rows={8}
                  value={resultData.parameters}
                  onChange={(e) => setResultData({ ...resultData, parameters: e.target.value })}
                  placeholder='[{"name":"Hemoglobin","value":"14.5","unit":"g/dL","referenceRange":"13-17","flag":"normal"}]'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea className="input-field" rows={2} value={resultData.summary}
                  onChange={(e) => setResultData({ ...resultData, summary: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interpretation</label>
                <textarea className="input-field" rows={2} value={resultData.interpretation}
                  onChange={(e) => setResultData({ ...resultData, interpretation: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary">Save Results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}