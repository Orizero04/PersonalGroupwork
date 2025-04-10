import React, {useEffect} from "react";
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import SelectExerciseListItem from "./SelectExerciseListItem";

function ExerciseSearchModal({
    isOpen,
    onClose,
    exercises,
    muscles,
    onSelectExercise,
    search,
    setSearch,
    selectedMuscle,
    setSelectedMuscle,
    page,
    setPage,
    totalPages
}) {

    // Prevent scrolling on the background when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; 
        } else {
            document.body.style.overflow = "";  
        }

        return () => {
            document.body.style.overflow = ""; 
        };
    }, [isOpen]);
    
    // Don't return anything unless isOpen is true
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Darkened Background Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative z-10 bg-white p-6 rounded shadow-lg w-8/12 h-5/6">
                <h1 className="text-2xl font-medium mb-1 text-left">Add Exercise</h1>
                <h3 className="text-sm text-left">Search for an exercise to add to your workout</h3>
                <div className="border-b border-gray-300 w-full mb-4 mt-2" />

                {/* Search and Filter */}
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Search exercises ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded w-1/3 text-xs outline-none  focus:border-gray-400 mr-8"
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
                </div>

                {/* List of Filtered Exercises with Scroll */}
                <div className="h-5/6 overflow-y-auto">
                    {exercises.length > 0 ? (
                        exercises.map((exercise) => (
                            <SelectExerciseListItem
                                key={exercise._id}
                                imageUrl={
                                    "http://localhost:5001/static/images/still/" +
                                    exercise.exerciseImages[0].replace(".gif", ".png")
                                }
                                title={exercise.name}
                                description={exercise.description}
                                muscles={[...(exercise.primaryMuscles || []), ...(exercise.secondaryMuscles || [])]}
                                onClick={() => {
                                    onSelectExercise && onSelectExercise(exercise);
                                    onClose();
                                }}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No exercises found.</p>
                    )}
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
        </div>
    );
}

export default ExerciseSearchModal;

