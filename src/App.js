import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    appliedDate: '',
    status: 'Applied',
    notes: '',
    salary: '',
    contactPerson: '',
    jobUrl: ''
  });
  const [showForm, setShowForm] = useState(false);

  // Load data from API on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // API functions
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/jobs`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.position) {
      alert('Please fill in at least Company and Position fields');
      return;
    }

    try {
      setLoading(true);
      const jobData = {
        ...formData,
        appliedDate: formData.appliedDate || new Date().toISOString().split('T')[0]
      };

      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        await fetchJobs(); // Refresh the jobs list
        setFormData({
          company: '',
          position: '',
          location: '',
          appliedDate: '',
          status: 'Applied',
          notes: '',
          salary: '',
          contactPerson: '',
          jobUrl: ''
        });
        setShowForm(false);
      } else {
        console.error('Failed to create job');
        alert('Failed to create job application');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Error creating job application');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchJobs(); // Refresh the jobs list
      } else {
        console.error('Failed to update status');
        alert('Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating job status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchJobs(); // Refresh the jobs list
        } else {
          console.error('Failed to delete job');
          alert('Failed to delete job application');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job application');
      }
    }
  };

  const handleCvUpload = async (id, file) => {
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch(`${API_BASE_URL}/jobs/${id}/cv`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchJobs(); // Refresh the jobs list
        alert('CV uploaded successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to upload CV: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Error uploading CV');
    } finally {
      setLoading(false);
    }
  };

  const handleCvDownload = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}/cv`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV_Job_${id}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to download CV');
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Error downloading CV');
    }
  };

  const handleCvDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete the CV for this job?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/${id}/cv`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchJobs(); // Refresh the jobs list
          alert('CV deleted successfully!');
        } else {
          console.error('Failed to delete CV');
          alert('Failed to delete CV');
        }
      } catch (error) {
        console.error('Error deleting CV:', error);
        alert('Error deleting CV');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'status-applied';
      case 'Interview': return 'status-interview';
      case 'Offer': return 'status-offer';
      case 'Rejected': return 'status-rejected';
      default: return 'status-applied';
    }
  };

  const getStats = () => {
    const total = jobs.length;
    const applied = jobs.filter(job => job.status === 'Applied').length;
    const interview = jobs.filter(job => job.status === 'Interview').length;
    const offer = jobs.filter(job => job.status === 'Offer').length;
    const rejected = jobs.filter(job => job.status === 'Rejected').length;

    return { total, applied, interview, offer, rejected };
  };

  const stats = getStats();

  return (
    <div className="container">
      <div className="header">
        <h1>Job Application Tracker</h1>
        <p>Keep track of your job applications and their status</p>
      </div>

      {jobs.length > 0 && (
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.applied}</div>
            <div className="stat-label">Applied</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.interview}</div>
            <div className="stat-label">Interview</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.offer}</div>
            <div className="stat-label">Offers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Add New Job Application</h2>
          <button 
            className="btn" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Application'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="company">Company *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Position *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="appliedDate">Applied Date</label>
                <input
                  type="date"
                  id="appliedDate"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="jobUrl">Job URL</label>
                <input
                  type="url"
                  id="jobUrl"
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes about this application..."
              />
            </div>

            <button type="submit" className="btn">
              Add Job Application
            </button>
          </form>
        )}
      </div>

      <div className="card">
        <h2>Your Job Applications</h2>
        {loading ? (
          <div className="empty-state">
            <h3>Loading...</h3>
            <p>Please wait while we fetch your job applications</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <h3>No job applications yet</h3>
            <p>Start by adding your first job application above!</p>
          </div>
        ) : (
          <div className="job-list">
            {jobs.map(job => (
              <div key={job.id} className="job-item">
                <div className="job-header">
                  <div>
                    <div className="job-title">{job.position}</div>
                    <div className="job-company">{job.company}</div>
                    {job.location && <div style={{ color: '#666', fontSize: '0.9rem' }}>📍 {job.location}</div>}
                  </div>
                  <div className={`status-badge ${getStatusColor(job.status)}`}>
                    {job.status}
                  </div>
                </div>

                <div className="job-details">
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Applied:</strong> {new Date(job.appliedDate).toLocaleDateString()}
                  </div>
                  
                  {job.salary && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Salary:</strong> {job.salary}
                    </div>
                  )}
                  
                  {job.contactPerson && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Contact:</strong> {job.contactPerson}
                    </div>
                  )}
                  
                  {job.jobUrl && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Job URL:</strong> <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>View Job Posting</a>
                    </div>
                  )}
                  
                  {job.notes && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Notes:</strong> {job.notes}
                    </div>
                  )}
                </div>

                <div className="job-actions">
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    className="btn btn-small"
                    style={{ background: 'white', color: '#333', border: '2px solid #e1e5e9' }}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <input
                      type="file"
                      id={`cv-upload-${job.id}`}
                      style={{ display: 'none' }}
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleCvUpload(job.id, file);
                        e.target.value = ''; // Reset input
                      }}
                    />
                    <label
                      htmlFor={`cv-upload-${job.id}`}
                      className="btn btn-small"
                      style={{ 
                        background: '#667eea', 
                        color: 'white', 
                        cursor: 'pointer',
                        display: 'inline-block',
                        padding: '8px 16px',
                        margin: 0
                      }}
                    >
                      📄 {job.cvPath ? 'Change CV' : 'Upload CV'}
                    </label>
                    
                    {job.cvPath && (
                      <>
                        <button
                          className="btn btn-small"
                          onClick={() => handleCvDownload(job.id)}
                          style={{ background: '#10b981', color: 'white' }}
                        >
                          ⬇️ Download CV
                        </button>
                        <button
                          className="btn btn-small"
                          onClick={() => handleCvDelete(job.id)}
                          style={{ background: '#f59e0b', color: 'white' }}
                        >
                          🗑️ Remove CV
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
