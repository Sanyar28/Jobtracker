import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import KanbanBoard from './KanbanBoard';
import AddJobModal from './AddJobModal';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await api.get('/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === 'APPLIED').length,
    interview: jobs.filter(j => j.status === 'INTERVIEW').length,
    offer: jobs.filter(j => j.status === 'OFFER').length,
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Job Tracker</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate('/resume-matcher')}
            style={{ padding: '8px 16px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            🔍 Resume Matcher
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            + Add Job
          </button>
          <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ddd' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', margin: '16px 0' }}>
        {[
          { label: 'Total', value: stats.total, color: '#3498db' },
          { label: 'Applied', value: stats.applied, color: '#e67e22' },
          { label: 'Interview', value: stats.interview, color: '#9b59b6' },
          { label: 'Offer', value: stats.offer, color: '#2ecc71' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: stat.color, color: 'white',
            padding: '12px 20px', borderRadius: '8px',
            textAlign: 'center', minWidth: '80px'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</div>
            <div style={{ fontSize: '12px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <KanbanBoard jobs={jobs} onJobsChange={fetchJobs} />
      {showModal && (
        <AddJobModal
          onClose={() => setShowModal(false)}
          onJobAdded={fetchJobs}
        />
      )}
    </div>
  );
}

export default Dashboard;