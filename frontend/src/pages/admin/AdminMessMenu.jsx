import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { UtensilsCrossed, Edit3, Save } from 'lucide-react';

const AdminMessMenu = () => {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState(null);
  const [editForm, setEditForm] = useState({
    breakfast: '',
    lunch: '',
    snacks: '',
    dinner: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await API.get('/mess');
      setMenuList(res.data.menu || []);
    } catch (err) {
      console.error('Error loading mess menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleStartEdit = (item) => {
    setEditingDay(item.day);
    setEditForm({
      breakfast: item.breakfast,
      lunch: item.lunch,
      snacks: item.snacks,
      dinner: item.dinner,
    });
  };

  const handleSaveMenu = async (dayName) => {
    try {
      await API.post('/mess', { day: dayName, ...editForm });
      setMessage({ type: 'success', text: `Mess menu for ${dayName} updated successfully!` });
      setEditingDay(null);
      fetchMenu();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update menu' });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Hostel Weekly Mess Schedule</h1>
        <p className="text-zinc-400 text-sm mt-1">Customize daily meal items for Breakfast, Lunch, Evening Snacks, and Dinner</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 font-semibold text-sm ${message.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-zinc-400">Loading weekly mess menu...</div>
        ) : (
          menuList.map((item) => {
            const isEditing = editingDay === item.day;

            return (
              <div key={item._id || item.day} className="card card-hover border-zinc-800 bg-zinc-900">
                <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed size={20} className="text-orange-500" />
                    <h3 className="text-base font-bold text-white">{item.day}</h3>
                  </div>
                  {isEditing ? (
                    <button onClick={() => handleSaveMenu(item.day)} className="btn btn-success btn-sm">
                      <Save size={14} /> Save
                    </button>
                  ) : (
                    <button onClick={() => handleStartEdit(item)} className="btn btn-outline btn-sm">
                      <Edit3 size={14} /> Edit
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-zinc-400 block mb-1">🍳 Breakfast:</strong>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.breakfast}
                        onChange={(e) => setEditForm({ ...editForm, breakfast: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-white">{item.breakfast}</p>
                    )}
                  </div>

                  <div>
                    <strong className="text-zinc-400 block mb-1">🍱 Lunch:</strong>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.lunch}
                        onChange={(e) => setEditForm({ ...editForm, lunch: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-white">{item.lunch}</p>
                    )}
                  </div>

                  <div>
                    <strong className="text-zinc-400 block mb-1">☕ Evening Snacks:</strong>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.snacks}
                        onChange={(e) => setEditForm({ ...editForm, snacks: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-white">{item.snacks}</p>
                    )}
                  </div>

                  <div>
                    <strong className="text-zinc-400 block mb-1">🍲 Dinner:</strong>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.dinner}
                        onChange={(e) => setEditForm({ ...editForm, dinner: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium text-white">{item.dinner}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminMessMenu;
