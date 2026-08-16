import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { UtensilsCrossed } from 'lucide-react';

const StudentMessMenu = () => {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await API.get('/mess');
        setMenuList(res.data.menu || []);
      } catch (err) {
        console.error('Error loading student mess menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Weekly Hostel Mess Schedule</h1>
        <p>Daily food menu for Breakfast, Lunch, Snacks, and Dinner</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ color: '#aaaaaa' }}>Loading weekly mess menu...</div>
        ) : (
          menuList.map((item) => (
            <div key={item._id || item.day} className="card card-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.75rem' }}>
                <UtensilsCrossed size={20} style={{ color: '#f97316' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{item.day}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div>
                  <strong style={{ color: '#aaaaaa', display: 'block', marginBottom: '0.25rem' }}>🍳 Breakfast:</strong>
                  <p style={{ fontWeight: 500 }}>{item.breakfast}</p>
                </div>
                <div>
                  <strong style={{ color: '#aaaaaa', display: 'block', marginBottom: '0.25rem' }}>🍱 Lunch:</strong>
                  <p style={{ fontWeight: 500 }}>{item.lunch}</p>
                </div>
                <div>
                  <strong style={{ color: '#aaaaaa', display: 'block', marginBottom: '0.25rem' }}>☕ Evening Snacks:</strong>
                  <p style={{ fontWeight: 500 }}>{item.snacks}</p>
                </div>
                <div>
                  <strong style={{ color: '#aaaaaa', display: 'block', marginBottom: '0.25rem' }}>🍲 Dinner:</strong>
                  <p style={{ fontWeight: 500 }}>{item.dinner}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

};

export default StudentMessMenu;
