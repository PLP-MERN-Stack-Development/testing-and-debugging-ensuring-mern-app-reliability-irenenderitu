import { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import { useBugs } from './hooks/useBugs';
import './App.css';

function App() {
  const { bugs, loading, error, createBug, updateBug, deleteBug } = useBugs();
  const [showForm, setShowForm] = useState(false);

  const handleCreateBug = async (bugData) => {
    console.log('[App] Creating new bug:', bugData);
    try {
      await createBug(bugData);
      setShowForm(false);
      // Form reset is handled by the form component's internal state
    } catch (error) {
      console.error('[App] Error in handleCreateBug:', error);
      // Error is already set in the hook
    }
  };

  const handleUpdateBug = async (id, updates) => {
    console.log('[App] Updating bug:', { id, updates });
    try {
      await updateBug(id, updates);
    } catch (error) {
      console.error('[App] Error in handleUpdateBug:', error);
      throw error; // Re-throw to let component handle it
    }
  };

  const handleDeleteBug = async (id) => {
    console.log('[App] Deleting bug:', id);
    try {
      await deleteBug(id);
    } catch (error) {
      console.error('[App] Error in handleDeleteBug:', error);
      throw error; // Re-throw to let component handle it
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>🐛 Bug Tracker</h1>
          <p>Track and manage software issues efficiently</p>
        </header>

        <main className="app-main">
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => window.location.reload()}>Dismiss</button>
            </div>
          )}

          <div className="app-controls">
            <button 
              onClick={() => setShowForm(!showForm)}
              className="toggle-form-btn"
            >
              {showForm ? 'Cancel' : 'Report New Bug'}
            </button>
          </div>

          {showForm && (
            <section className="form-section">
              <h2>Report a New Bug</h2>
              <BugForm 
                onSubmit={handleCreateBug}
                loading={loading}
              />
            </section>
          )}

          <section className="list-section">
            <h2>All Bugs ({bugs.length})</h2>
            <BugList
              bugs={bugs}
              onUpdateBug={handleUpdateBug}
              onDeleteBug={handleDeleteBug}
              loading={loading}
            />
          </section>
        </main>

        <footer className="app-footer">
          <p>Bug Tracker - Testing & Debugging Demo</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;