import { useState } from 'react';
import api from './api';

function AddJobModal({ onClose, onJobAdded }) {
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'WISHLIST',
    deadline: ''
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post('/api/jobs', form);
      onJobAdded();
      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', borderRadius: '12px',
        padding: '24px', width: '400px'
      }}>
        <h2 style={{ marginBottom: '16px' }}>Add New Job</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
          >
            <option>WISHLIST</option>
            <option>APPLIED</option>
            <option>INTERVIEW</option>
            <option>OFFER</option>
            <option>REJECTED</option>
          </select>
          <input
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '16px', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={{ flex: 1, padding: '8px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Add Job
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '8px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJobModal;