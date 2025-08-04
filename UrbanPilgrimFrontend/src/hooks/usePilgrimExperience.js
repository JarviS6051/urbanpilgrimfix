// src/hooks/usePilgrimExperiences.js
import { useState, useEffect, useCallback } from 'react';
import { pilgrimExperienceApi } from '../services/pilgrimExperienceApi';

export const usePilgrimExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiences = useCallback(async () => {
    try {
      console.log('Starting to fetch experiences...');
      setLoading(true);
      setError(null);
      
      const data = await pilgrimExperienceApi.getAll();
      console.log('Received data from API:', data);
      
      // Handle different response structures
      let experiencesArray = [];
      if (data && Array.isArray(data)) {
        experiencesArray = data;
      } else if (data && data.pilgrimExperiences && Array.isArray(data.pilgrimExperiences)) {
        experiencesArray = data.pilgrimExperiences;
      } else if (data && data.data && Array.isArray(data.data)) {
        experiencesArray = data.data;
      } else {
        console.warn('Unexpected data structure:', data);
        experiencesArray = [];
      }
      
      console.log('Setting experiences:', experiencesArray);
      setExperiences(experiencesArray);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch experiences';
      setError(errorMessage);
      console.error('Error fetching experiences:', err);
      setExperiences([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const refetch = useCallback(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return {
    experiences,
    loading,
    error,
    refetch
  };
};

export default usePilgrimExperiences;