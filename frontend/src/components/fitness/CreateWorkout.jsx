import React, { useState, useEffect } from "react";
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import ExerciseListItem from './ExerciseListItem'
import ExerciseSearchModal from "./ExerciseSearchModal";
import { useExercises } from "../../hooks/useExercises";
import { useMuscles } from "../../hooks/useMuscles";

function CreateWorkout() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 9;
    const [search, setSearch] = useState("");
    const [selectedMuscle, setSelectedMuscle] = useState("");
    const [workoutExercises, setWorkoutExercises] = useState([]);
    const [errors, setErrors] = useState({});

    const { exercises, totalPages } = useExercises(page, limit, search, selectedMuscle);
    const allMuscles = useMuscles();

    const handleAddExercise = (exercise) => {
        setWorkoutExercises((prev) => [
            ...prev,
            {
                exerciseId: exercise._id,
                quantityValues: {
                    sets: exercise.recommended.minRecommendedSets,
                    reps: exercise.recommended.minRecommendedReps,
                    timeInMinutes: exercise.recommended.timeInMinutes,
                    distanceInKm: exercise.recommended.distanceInKm,
                },
                exerciseData: exercise,
            },
        ]);
        setIsModalOpen(false);
    };

    // Remove exercise at index
    const handleRemoveExercise = (index) => {
        setWorkoutExercises(prevExercises => prevExercises.filter((_, i) => i !== index));
    };

    // Handler to update a specific exercise's quantity values
    const handleQuantityChange = (index, updatedValues) => {
        setWorkoutExercises((prevExercises) => {
            const newExercises = [...prevExercises];
            newExercises[index] = {
                ...newExercises[index],
                quantityValues: { ...newExercises[index].quantityValues, ...updatedValues },
            };
            return newExercises;
        });
    };

    // Validate required fields and create the workout
    const handleCreateWorkout = async () => {
        let newErrors = {};
        if (!title.trim()) {
            newErrors.title = "Title is required";
        }
        if (!dateTime.trim()) {
            newErrors.dateTime = "Date and Time are required";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const workoutData = {
            title,
            description,
            dateTime,
            exercises: workoutExercises.map(ex => ({
                exerciseId: ex.exerciseId,
                sets: ex.quantityValues.sets,
                reps: ex.quantityValues.reps,
                timeInMinutes: ex.quantityValues.timeInMinutes,
                distanceInKm: ex.quantityValues.distanceInKm,
            })),
        };

        try {
            const response = await fetch("http://localhost:5001/api/v1/workouts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_MOCK_TOKEN}`,
                },
                body: JSON.stringify(workoutData),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || "Failed to create workout");
            }
                
            // Reset form on success
            setTitle("");
            setDescription("");
            setDateTime("");
            setWorkoutExercises([]);
            setErrors({});
            
            alert("Workout created successfully!");
    
        } catch (error) {
            console.error("Error creating workout:", error);
            setErrors({ api: error.message });
        }

        // If no errors, proceed to create the workout 
        console.log("Submitting workout:", {
            title,
            description,
            dateTime,
            exercises: workoutExercises,
        });

        // Reset errors on success
        setErrors({});
    };

    return (

        <div className="flex justify-center mt-4 mb-4">
            <div className="container border border-gray-100 rounded p-4">
                <h1 className="text-left text-2xl font-medium">Create Workout</h1>
                <h4 className="text-left text-xs text-gray-500">Fields marked with an asterisk (*) must be completed</h4>

                <div className="border-b border-gray-300 w-full mb-4 mt-1" />

                <div className="text-left mb-4">
                    <h4 className="mb-1 text-sm">Title*</h4>
                    <input
                        type="text"
                        placeholder="Workout Title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) {
                                setErrors((prev) => ({ ...prev, title: undefined }));
                            }
                        }}
                        className={`border p-2 rounded w-1/3 text-xs outline-none ${errors.title ? "border-red-500" : ""}`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div className="text-left mb-4">
                    <h4 className="mb-1 text-sm">Description</h4>
                    <textarea
                        placeholder="Workout description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="border p-2 rounded w-2/4 text-xs outline-none"
                    />
                </div>

                <div className="text-left mb-6">
                    <h4 className="mb-1 text-sm" >Date, Time*</h4>
                    <input
                        type="datetime-local"
                        value={dateTime}
                        onChange={(e) => {
                            setDateTime(e.target.value);
                            if (errors.dateTime) {
                                setErrors((prev) => ({ ...prev, dateTime: undefined }));
                            }
                        }}
                        className={`border p-2 rounded text-xs ${errors.dateTime ? "border-red-500" : ""}`}
                    />
                    {errors.dateTime && <p className="text-red-500 text-xs mt-1">{errors.dateTime}</p>}
                </div>

                {/* Exercises */}
                <div>
                    {/* Title and Button */}
                    <div className="flex">
                        <h2 className="text-base font-medium">Selected Exercises</h2>
                        <button onClick={() => setIsModalOpen(true)}>
                            <PlusCircleIcon className="h-4 w-4 ml-2 text-blue-500" strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="border-b border-gray-200 w-full mb-4 mt-1" />
                    {workoutExercises.length > 0 ? (
                        workoutExercises.map((exercise, index) => (
                            <ExerciseListItem
                                key={exercise.exerciseId}
                                imageUrl={
                                    "http://localhost:5001/static/images/still/" + exercise.exerciseData.exerciseImages[0].replace(".gif", ".png")
                                }
                                title={exercise.exerciseData.name}
                                description={exercise.exerciseData.description}
                                logType={exercise.exerciseData.logType}
                                recommendedAmount={exercise.exerciseData.recommended}
                                muscles={[
                                    ...exercise.exerciseData.primaryMuscles,
                                    ...exercise.exerciseData.secondaryMuscles,
                                ]}
                                quantityValues={exercise.quantityValues}
                                onChangeQuantity={(updatedValues) => handleQuantityChange(index, updatedValues)}
                                onRemove={() => handleRemoveExercise(index)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40">
                            <p className="text-sm text-gray-500">No exercise added yet</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded text-sm"
                            >
                                Add Exercises
                            </button>
                        </div>
                    )}
                </div>
                {/* TODO: Submit button */}
                {workoutExercises.length > 0 && (
                    <div className="mt-6 flex flex-col items-center">
                        <button
                            onClick={handleCreateWorkout}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 transition-colors text-white rounded"
                        >
                            Create Workout
                        </button>
                        {(errors.title || errors.dateTime) && (
                            <p className="text-red-500 text-xs mt-2">
                                Please fill in all required fields.
                            </p>
                        )}
                    </div>
                )}

                <ExerciseSearchModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    exercises={exercises}
                    muscles={allMuscles}
                    onSelectExercise={handleAddExercise}
                    search={search}
                    setSearch={setSearch}
                    selectedMuscle={selectedMuscle}
                    setSelectedMuscle={setSelectedMuscle}
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}

export default CreateWorkout;
