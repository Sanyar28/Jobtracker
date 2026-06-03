import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResumeMatcher() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleAnalyze() {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Please paste both your resume and the job description.');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://jobtracker-backend-yy2s.onrender.com/api/match',  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resume, jobDescription })
      });

      const text = await response.text();
      const parsed = JSON.parse(text);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score) {
    if (score >= 75) return '#2ecc71';
    if (score >= 50) return '#e67e22';
    return '#e74c3c';
  }

  function getScoreLabel(score) {
    if (score >= 75) return 'Strong Match';
    if (score >= 50) return 'Moderate Match';
    return 'Weak Match';
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Resume Matcher</h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: '14px' }}>
            Paste your resume and a job description to see how well you match
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
            Your Resume
          </label>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste your resume text here..."
            style={{
              width: '100%', height: '300px', padding: '12px',
              borderRadius: '8px', border: '1px solid #ddd',
              fontSize: '13px', resize: 'vertical', boxSizing: 'border-box',
              fontFamily: 'monospace'
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            style={{
              width: '100%', height: '300px', padding: '12px',
              borderRadius: '8px', border: '1px solid #ddd',
              fontSize: '13px', resize: 'vertical', boxSizing: 'border-box',
              fontFamily: 'monospace'
            }}
          />
        </div>
      </div>

      {error && (
        <p style={{ color: '#e74c3c', marginBottom: '12px', fontSize: '14px' }}>{error}</p>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          width: '100%', padding: '12px',
          background: loading ? '#aaa' : '#3498db',
          color: 'white', border: 'none', borderRadius: '8px',
          fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '24px'
        }}
      >
        {loading ? '⏳ Analyzing...' : '🔍 Analyze Match'}
      </button>

      {result && (
        <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '24px' }}>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-block',
              width: '120px', height: '120px', borderRadius: '50%',
              background: getScoreColor(result.score),
              color: 'white', lineHeight: '120px',
              fontSize: '36px', fontWeight: 'bold'
            }}>
              {result.score}
            </div>
            <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 'bold', color: getScoreColor(result.score) }}>
              {getScoreLabel(result.score)}
            </div>
          </div>

          <div style={{ marginBottom: '20px', padding: '16px', background: 'white', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
            <h3 style={{ margin: '0 0 8px' }}>Assessment</h3>
            <p style={{ margin: 0, lineHeight: '1.6', color: '#444' }}>{result.summary}</p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '16px', borderLeft: '4px solid #2ecc71' }}>
              <h3 style={{ margin: '0 0 12px', color: '#2ecc71' }}>✅ Matched Skills</h3>
              {result.matchedSkills.length === 0
                ? <p style={{ color: '#888', fontSize: '13px' }}>None found</p>
                : result.matchedSkills.map((skill, i) => (
                  <span key={i} style={{
                    display: 'inline-block', background: '#e8f5e9',
                    color: '#2e7d32', padding: '4px 10px', borderRadius: '20px',
                    fontSize: '13px', margin: '3px'
                  }}>{skill}</span>
                ))
              }
            </div>
            <div style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '16px', borderLeft: '4px solid #e74c3c' }}>
              <h3 style={{ margin: '0 0 12px', color: '#e74c3c' }}>❌ Missing Skills</h3>
              {result.missingSkills.length === 0
                ? <p style={{ color: '#888', fontSize: '13px' }}>None — great fit!</p>
                : result.missingSkills.map((skill, i) => (
                  <span key={i} style={{
                    display: 'inline-block', background: '#ffebee',
                    color: '#c62828', padding: '4px 10px', borderRadius: '20px',
                    fontSize: '13px', margin: '3px'
                  }}>{skill}</span>
                ))
              }
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default ResumeMatcher;