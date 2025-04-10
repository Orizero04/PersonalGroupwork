import { useState, useEffect, useCallback } from "react";

/**
 * Custom Hook for fetching a user's workouts from the API.
 * Returns an object containing:
 *   - workouts: Array of all workouts.
 *   - refetch: Function to re-fetch workouts from the API.
 */
export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);

  // Use useCallback so that fetchWorkouts is stable between renders.
  const fetchWorkouts = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5001/api/v1/workouts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setWorkouts(data.workouts || []);
    } catch (err) {
      console.error("Failed to fetch workouts:", err);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { workouts, refetch: fetchWorkouts };
};
