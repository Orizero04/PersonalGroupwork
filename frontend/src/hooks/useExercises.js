import { useState, useEffect } from "react";

/**
 * Custom Hook for fetching exercises with pagination, search, and muscle filtering.
 * This hook fetches exercise data from the API based on the provided page, limit, search query,
 * and selected muscle. It debounces the search input to reduce API calls.
 *
 * @param {number} page - The current page number.
 * @param {number} limit - The number of exercises per page.
 * @param {string} search - The search query for filtering exercises.
 * @param {string} selectedMuscle - The ID of the selected muscle for filtering.
 * @returns {Object} - An object containing:
 *   - exercises: An array of exercise objects.
 *   - totalPages: The total number of pages available.
 */
export const useExercises = (page, limit, search, selectedMuscle) => {
    const [exercises, setExercises] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Debounce the search input to reduce frequent API calls.
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 200);
        return () => clearTimeout(timeout);
    }, [search]);

    // Fetch exercises whenever page, limit, debouncedSearch, or selectedMuscle changes.
    useEffect(() => {
        let query = `page=${page}&limit=${limit}`;
        if (debouncedSearch) query += `&search=${debouncedSearch}`;
        if (selectedMuscle) query += `&muscle=${selectedMuscle}`;

        fetch(`http://localhost:5001/api/v1/exercises?${query}`)
            .then((res) => res.json())
            .then((data) => {
                setExercises(data.data);
                setTotalPages(data.totalPages);
            })
            .catch((err) => console.error("Error fetching exercises:", err));
    }, [page, limit, debouncedSearch, selectedMuscle]);

    return { exercises, totalPages };
};
