import { useState, useEffect } from "react";

/**
 * Custom Hook for fetching muscles.
 * Fetches the list of muscles from the API when the component mounts.
 *
 * @returns {Array} - An array of muscle objects.
 */
export const useMuscles = () => {
  const [muscles, setMuscles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/v1/muscles")
      .then((res) => res.json())
      .then((data) => setMuscles(data))
      .catch((err) => console.error("Error fetching muscles:", err));
  }, []);

  return muscles;
};
