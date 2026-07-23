import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

const statusStyles: Record<string, string> = {
  pending: 'badge-pending',
  sample_collected: 'badge-progress',
  in_progress: 'badge-progress',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};
const statusLabels: Record<string, string> = {
  pending: 'Pending',
  sample_collected: 'Sample Collected',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function Tests() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm] = useState({
    testName: '', patientId: '', priority: 'routine',
    price: '', description: '', notes: '',
  });

  const fetchTests = async () => {
    try {
      const res: any = await api.get('/tests', { params: { limit: 50 } });
      setTests(res.data || []);
    } catch { toast.error('Failed to load tests'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTests(); }, []);
  useEffect(() => {
    if (showModal) {
      api.get('/patients', { params: { limit: 100 } }).then((res: any) => setPatients(res.data || []));
    }
  }, [showModal]);

  const handleCreate = async () => {
    try {
      await api.post('/tests', form);
      toast.success('Test ordered');
      setShowModal(false);
      setForm({ testName: '', patientId: '', priority: 'routine', price: '', description: '', notes: '' });
      fetchTests();
    } catch (err: any) { toast.error(err?.message?.[0] || 'Failed'); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/tests/${id}/status`, { status });
      toast.success(`Status updated to ${statusLabels[status]}`);
      fetchTests();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Lab Tests</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ New Test</button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Test #</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Test Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : tests.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No tests found</td></tr>
            ) : tests.map((t: any) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-primary-600">{t.testNumber}</td>
                <td className="px-4 py-3 text-sm font-medium">{t.testName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {t.patient?.firstName} {t.patient?.lastName}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`${t.priority === 'stat' ? 'bg-red-100 text-red-800' : t.priority === 'urgent' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'} text-xs font-medium px-2.5 py-0.5 rounded-full capitalize`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={statusStyles[t.status]}>{statusLabels[t.status]}</span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value=""
                    onChange={(e) => e.value && updateStatus(t.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="" disabled>Change</option>
                    <option value="sample_collected">Sample Collected</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancel</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Order New Test</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <select className="input-field" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
                  <option value="">Select patient...</option>
                  {patients.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.patientId} - {p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                <input className="input-field" value={form.testName} onChange={(e) => setForm({ ...form, testName: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="input-field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="stat">STAT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input className="input-field" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea className="input-field" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleCreate} className="btn-primary">Create Test</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}