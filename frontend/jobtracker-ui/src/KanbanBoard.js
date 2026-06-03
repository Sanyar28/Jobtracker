import { useState } from 'react';
import api from './api';
import EditJobModal from './EditJobModal';

const STATUSES = ['WISHLIST', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

const COLORS = {
  WISHLIST: '#e3f2fd',
  APPLIED: '#fff3e0',
  INTERVIEW: '#f3e5f5',
  OFFER: '#e8f5e9',
  REJECTED: '#ffebee'
};

function KanbanBoard({ jobs, onJobsChange }) {
  const [editingJob, setEditingJob] = useState(null);

  async function handleStatusChange(job, newStatus) {
    try {
      await api.put(`/api/jobs/${job.id}`, { ...job, status: newStatus, user: null });
      onJobsChange();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(jobId) {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/api/jobs/${jobId}`);
      onJobsChange();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {/* Edit modal — only mounts when a job is selected */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onJobUpdated={() => {
            onJobsChange();
            setEditingJob(null);
          }}
        />
      )}

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '16px 0' }}>
        {STATUSES.map(status => (
          <div key={status} style={{ minWidth: '200px', flex: 1 }}>
            <h3 style={{ textAlign: 'center', marginBottom: '8px' }}>{status}</h3>
            <div style={{
              background: COLORS[status],
              borderRadius: '8px',
              padding: '8px',
              minHeight: '200px'
            }}>
              {jobs.filter(j => j.status === status).map(job => (
                <div key={job.id} style={{
                  background: 'white',
                  borderRadius: '6px',
                  padding: '10px',
                  marginBottom: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {/* Card header: company name + edit + delete */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '14px' }}>{job.company}</strong>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => setEditingJob(job)}
                        title="Edit job"
                        style={{
                          background: 'none', border: 'none',
                          cursor: 'pointer', fontSize: '14px', padding: '2px'
                        }}
                      >✏️</button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        title="Delete job"
                        style={{
                          background: 'none', border: 'none',
                          cursor: 'pointer', color: 'red', fontSize: '14px', padding: '2px'
                        }}
                      >🗑️</button>
                    </div>
                  </div>

                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{job.role}</p>
                  {job.deadline && (
                    <p style={{ margin: '4px 0', fontSize: '11px', color: '#888' }}>📅 {job.deadline}</p>
                  )}
                  <select
                    value={job.status}
                    onChange={e => handleStatusChange(job, e.target.value)}
                    style={{ width: '100%', marginTop: '6px', padding: '4px', fontSize: '12px' }}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default KanbanBoard;