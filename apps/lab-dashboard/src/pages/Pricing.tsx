import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function Pricing() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', price: '', description: '', preparationInstructions: '' });

  const fetchItems = async () => {
    try {
      const res: any = await api.get('/pricing', { params: { limit: 100 } });
      setItems(res.data || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleCreate = async () => {
    try {
      await api.post('/pricing', form);
      toast.success('Price item added');
      setShowModal(false);
      setForm({ name: '', category: '', price: '', description: '', preparationInstructions: '' });
      fetchItems();
    } catch (err: any) { toast.error(err?.message?.[0] || 'Failed'); }
  };

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Pricing & Test Catalog</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Add Item</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat} className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{cat}</h3>
            <div className="space-y-2">
              {items.filter((i) => i.category === cat).map((item) => (
                <div key={item.id} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900">${Number(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {categories.length === 0 && !loading && (
          <p className="text-gray-400 col-span-3 text-center py-8">No price items configured yet</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Add Price Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Hematology" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input className="input-field" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Instructions</label>
                <textarea className="input-field" rows={2} value={form.preparationInstructions} onChange={(e) => setForm({ ...form, preparationInstructions: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleCreate} className="btn-primary">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}