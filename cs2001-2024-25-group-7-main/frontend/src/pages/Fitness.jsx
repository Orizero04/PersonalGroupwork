import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useExercises } from "../hooks/useExercises";
import { useMuscles } from "../hooks/useMuscles";
import ExerciseCard from "../components/fitness/ExerciseCard";
import WorkoutSidebar from "../components/fitness/WorkoutSidebar";
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';

const Fitness = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const BASE_URL = "http://localhost:5001/static/images/still/"
  const { exercises, totalPages } = useExercises(page, limit, search, selectedMuscle);
  const muscles = useMuscles();

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mx-auto px-4 text-left">
      <div className="flex gap-8">
        {/* Left Column: Exercises & Filters */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mt-8">Exercises</h1>
          <h3 className="text-sm font-normal mb-4">
            Search to find the perfect exercises for your workout.
          </h3>

          {/* Search & Filters */}
          <div className="flex items-center gap-4 mb-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded w-full md:w-1/3 text-xs outline-none focus:border-gray-400"
            />

            {/* Muscle Dropdown */}
            <div className="relative md:w-1/6 w-full">
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="block appearance-none w-full border p-2 rounded bg-white text-gray-700 focus:outline-none focus:border-gray-400 text-xs"
              >
                <option value="">All Muscles</option>
                {muscles.map((muscle) => (
                  <option key={muscle._id} value={muscle._id}>
                    {muscle.name}
                  </option>
                ))}
              </select>
              {/* Positioned Chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="flex-1"></div>

            {/* Create Workout Button */}
            {user && (
              <Link to="/workout">
                <button className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white rounded text-xs">
                  <PlusIcon className="h-4 w-4 mr-2" strokeWidth={3} />
                  Create Workout
                </button>
              </Link>
            )}
          </div>

          {/* Grid of Exercises */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise._id}
                _id={exercise._id}
                imageUrl={
                  BASE_URL + exercise.exerciseImages[0].replace(".gif", ".png")
                }
                title={exercise.name}
                description={exercise.description}
                muscles={[
                  ...(exercise.primaryMuscles || []),
                  ...(exercise.secondaryMuscles || []),
                ]}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 mb-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`mx-1 px-3 py-1 border rounded ${pageNumber === page
                      ? "bg-blue-500 text-white hover:bg-blue-400"
                      : "bg-white text-blue-500 hover:bg-blue-100"
                    }`}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        </div>

        {/* Right Column: Workout Sidebar (Calendar) */}
        <div className="w-64 mt-8">
          <WorkoutSidebar />
        </div>
      </div>
    </div>
  );

};

export default Fitness;