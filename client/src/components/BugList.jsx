import { useState } from 'react';

const BugList = ({ bugs, onUpdateBug, onDeleteBug, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const filteredBugs = filterStatus 
    ? bugs.filter(bug => bug.status === filterStatus)
    : bugs;

  const handleStatusChange = async (bugId, newStatus) => {
    console.log('[BugList] Changing status:', { bugId, newStatus });
    try {
      await onUpdateBug(bugId, { status: newStatus });
      setEditingId(null);
    } catch (error) {
      console.error('[BugList] Error updating status:', error);
    }
  };

  const handleDelete = async (bugId) => {
    console.log('[BugList] Deleting bug:', bugId);
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await onDeleteBug(bugId);
      } catch (error) {
        console.error('[BugList] Error deleting bug:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': '#e53e3e',
      'in-progress': '#d69e2e',
      'resolved': '#38a169',
      'closed': '#718096'
    };
    return colors[status] || '#718096';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#38a169',
      'medium': '#d69e2e',
      'high': '#ed8936',
      'critical': '#e53e3e'
    };
    return colors[priority] || '#718096';
  };

  if (loading) {
    return <div className="loading">Loading bugs...</div>;
  }

  return (
    <div className="bug-list">
      <div className="filters">
        <label>
          Filter by Status:
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </label>
      </div>

      {filteredBugs.length === 0 ? (
        <div className="empty-state">
          {bugs.length === 0 ? 'No bugs reported yet.' : 'No bugs match the current filter.'}
        </div>
      ) : (
        <div className="bugs-grid">
          {filteredBugs.map(bug => (
            <div key={bug._id} className="bug-card">
              <div className="bug-header">
                <h3 className="bug-title">{bug.title}</h3>
                <div className="bug-meta">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(bug.status) }}
                  >
                    {bug.status}
                  </span>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(bug.priority) }}
                  >
                    {bug.priority}
                  </span>
                </div>
              </div>

              <p className="bug-description">{bug.description}</p>

              <div className="bug-details">
                <div className="detail">
                  <strong>Reporter:</strong> {bug.reporter}
                </div>
                {bug.assignee && (
                  <div className="detail">
                    <strong>Assignee:</strong> {bug.assignee}
                  </div>
                )}
                {bug.environment && (
                  <div className="detail">
                    <strong>Environment:</strong> {bug.environment}
                  </div>
                )}
                <div className="detail">
                  <strong>Created:</strong> {new Date(bug.createdAt).toLocaleDateString()}
                </div>
              </div>

              {bug.stepsToReproduce && bug.stepsToReproduce.length > 0 && (
                <div className="steps">
                  <strong>Steps to Reproduce:</strong>
                  <ol>
                    {bug.stepsToReproduce.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="bug-actions">
                <select
                  value={bug.status}
                  onChange={(e) => handleStatusChange(bug._id, e.target.value)}
                  style={{ borderColor: getStatusColor(bug.status) }}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <button
                  onClick={() => handleDelete(bug._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;