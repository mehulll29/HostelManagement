import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { BedDouble, Plus, Edit3, Trash2, UserPlus } from 'lucide-react';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [unallocatedStudents, setUnallocatedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Room Form State
  const [roomForm, setRoomForm] = useState({
    number: '',
    block: 'A Block',
    type: 'Non-AC',
    capacity: 2,
  });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchRoomsAndStudents = async () => {
    try {
      setLoading(true);
      const [roomsRes, studentsRes] = await Promise.all([
        API.get('/rooms'),
        API.get('/students'),
      ]);
      setRooms(roomsRes.data.rooms || []);

      const allStudents = studentsRes.data.students || [];
      setUnallocatedStudents(allStudents.filter((s) => !s.room));
    } catch (err) {
      console.error('Error fetching room management data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsAndStudents();
  }, []);

  const handleOpenAddRoom = () => {
    setEditingRoomId(null);
    setRoomForm({ number: '', block: 'A Block', type: 'Non-AC', capacity: 2 });
    setShowRoomModal(true);
  };

  const handleOpenEditRoom = (room) => {
    setEditingRoomId(room._id);
    setRoomForm({
      number: room.number,
      block: room.block,
      type: room.type,
      capacity: room.capacity,
    });
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      if (editingRoomId) {
        await API.put(`/rooms/${editingRoomId}`, roomForm);
        setMessage({ type: 'success', text: 'Room updated successfully!' });
      } else {
        await API.post('/rooms', roomForm);
        setMessage({ type: 'success', text: 'New room added successfully!' });
      }
      setShowRoomModal(false);
      fetchRoomsAndStudents();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    }
  };

  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) {
      try {
        await API.delete(`/rooms/${roomId}`);
        setMessage({ type: 'success', text: `Room ${roomNumber} deleted successfully!` });
        fetchRoomsAndStudents();
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete room' });
      }
    }
  };

  const handleOpenAllocate = (room) => {
    setSelectedRoom(room);
    setSelectedStudentId('');
    setShowAllocateModal(true);
  };

  const handleAllocateStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    try {
      await API.post(`/rooms/${selectedRoom._id}/allocate`, { studentId: selectedStudentId });
      setMessage({ type: 'success', text: 'Student allocated to room!' });
      setShowAllocateModal(false);
      fetchRoomsAndStudents();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Allocation failed' });
    }
  };

  const handleDeallocateStudent = async (roomId, studentId) => {
    if (window.confirm('Deallocate student from this room?')) {
      try {
        await API.post(`/rooms/${roomId}/deallocate`, { studentId });
        setMessage({ type: 'success', text: 'Student deallocated successfully!' });
        fetchRoomsAndStudents();
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Deallocation failed' });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Hostel Room Allocations & Inventory</h1>
          <p className="text-zinc-400 text-sm mt-1">Configure hostel rooms, manage AC/Non-AC types, and assign student beds</p>
        </div>
        <button onClick={handleOpenAddRoom} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Room</span>
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 font-semibold text-sm ${message.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-zinc-400">Loading room inventory...</div>
        ) : rooms.length === 0 ? (
          <div className="text-zinc-400">No rooms found. Click "Add New Room" to create one.</div>
        ) : (
          rooms.map((room) => (
            <div key={room._id} className="card card-hover flex flex-col justify-between border-zinc-800 bg-zinc-900">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <BedDouble size={22} className="text-orange-500" />
                    <h3 className="text-lg font-bold text-white">Room {room.number}</h3>
                  </div>
                  <span className={`badge ${room.type === 'AC' ? 'badge-in-progress' : 'badge-available'}`}>
                    {room.type}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-3">
                  Block: {room.block} • Status:{' '}
                  <span className={`badge ${room.occupiedBeds >= room.capacity ? 'badge-full' : 'badge-resolved'}`}>
                    {room.occupiedBeds >= room.capacity ? 'Full' : 'Available'}
                  </span>
                </p>

                <div className="bg-zinc-950/60 border border-zinc-800 p-3 rounded-xl mb-4">
                  <p className="text-xs font-bold text-zinc-200 mb-2">
                    Occupancy: {room.occupiedBeds} / {room.capacity} Beds
                  </p>
                  {room.occupants && room.occupants.length > 0 ? (
                    <ul className="pl-4 text-xs space-y-1">
                      {room.occupants.map((occ) => (
                        <li key={occ._id} className="text-zinc-300">
                          <span className="font-semibold text-white">{occ.fullName}</span> ({occ.rollNumber || 'Student'})
                          <button
                            onClick={() => handleDeallocateStudent(room._id, occ._id)}
                            className="text-red-400 hover:text-red-300 ml-2 font-bold cursor-pointer"
                            title="Deallocate student bed"
                          >
                            &times; Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">No occupants yet</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 border-t border-zinc-800 pt-3">
                <button
                  onClick={() => handleOpenAllocate(room)}
                  disabled={room.occupiedBeds >= room.capacity}
                  className="btn btn-secondary btn-sm flex-1 justify-center text-xs"
                >
                  <UserPlus size={14} /> Allocate Bed
                </button>
                <button onClick={() => handleOpenEditRoom(room)} className="btn btn-outline btn-sm">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDeleteRoom(room._id, room.number)} className="btn btn-danger btn-sm">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal to Create/Edit Room */}
      {showRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingRoomId ? 'Edit Room Configuration' : 'Add New Room'}</h3>
              <button onClick={() => setShowRoomModal(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSaveRoom} className="space-y-4 mt-4">
              <div className="form-group">
                <label>Room Number *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. A-103"
                  value={roomForm.number}
                  onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Block</label>
                  <input
                    type="text"
                    className="form-control"
                    value={roomForm.block}
                    onChange={(e) => setRoomForm({ ...roomForm, block: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    className="form-control"
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                  >
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Bed Capacity *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="form-control"
                  required
                  value={roomForm.capacity}
                  onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowRoomModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to Allocate Student Bed */}
      {showAllocateModal && selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Allocate Bed in Room {selectedRoom.number}</h3>
              <button onClick={() => setShowAllocateModal(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleAllocateStudent} className="space-y-4 mt-4">
              <div className="form-group">
                <label>Select Unallocated Student</label>
                {unallocatedStudents.length === 0 ? (
                  <p className="text-zinc-400 text-sm">
                    All students are currently allocated to rooms. Register a new student first.
                  </p>
                ) : (
                  <select
                    className="form-control"
                    required
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                  >
                    <option value="">-- Choose Student --</option>
                    {unallocatedStudents.map((st) => (
                      <option key={st._id} value={st._id}>
                        {st.fullName} ({st.rollNumber || st.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAllocateModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={unallocatedStudents.length === 0}>
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
