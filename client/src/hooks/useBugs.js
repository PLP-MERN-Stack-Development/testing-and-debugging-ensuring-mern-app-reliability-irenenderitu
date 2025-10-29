import { useState, useEffect } from 'react';
import { bugAPI } from '../utils/api';

// Custom hook for bug management with error handling
export const useBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBugs = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('[useBugs] Fetching bugs with filters:', filters);
      
      const response = await bugAPI.getAllBugs(filters);
      setBugs(response.data.data);
    } catch (err) {
      console.error('[useBugs] Error fetching bugs:', err);
      setError(err.response?.data?.message || 'Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  };

  const createBug = async (bugData) => {
    try {
      setError(null);
      console.log('[useBugs] Creating bug:', bugData);
      
      const response = await bugAPI.createBug(bugData);
      await fetchBugs(); // Refresh the list
      return response.data;
    } catch (err) {
      console.error('[useBugs] Error creating bug:', err);
      setError(err.response?.data?.message || 'Failed to create bug');
      throw err;
    }
  };

  const updateBug = async (id, updates) => {
    try {
      setError(null);
      console.log('[useBugs] Updating bug:', { id, updates });
      
      const response = await bugAPI.updateBug(id, updates);
      await fetchBugs(); // Refresh the list
      return response.data;
    } catch (err) {
      console.error('[useBugs] Error updating bug:', err);
      setError(err.response?.data?.message || 'Failed to update bug');
      throw err;
    }
  };

  const deleteBug = async (id) => {
    try {
      setError(null);
      console.log('[useBugs] Deleting bug:', id);
      
      await bugAPI.deleteBug(id);
      await fetchBugs(); // Refresh the list
    } catch (err) {
      console.error('[useBugs] Error deleting bug:', err);
      setError(err.response?.data?.message || 'Failed to delete bug');
      throw err;
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return {
    bugs,
    loading,
    error,
    fetchBugs,
    createBug,
    updateBug,
    deleteBug
  };
};