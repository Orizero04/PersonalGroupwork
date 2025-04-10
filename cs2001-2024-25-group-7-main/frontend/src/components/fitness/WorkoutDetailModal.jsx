import React, { useState, useEffect, useRef } from "react";
import { formatWorkoutDate, formatWorkoutTime } from "../../utils/dateUtils";
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import EllipsisDropdown from "./EllipsisDropdown";

function WorkoutDetailModal({ workout, onClose, onDeleteSuccess }) {
    const [exerciseDetails, setExerciseDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the full details for all exercises in the workout
    useEffect(() => {
        if (!workout || !workout.exercises || workout.exercises.length === 0) {
            setExerciseDetails([]);
            setLoading(false);
            return;
        }

        const fetchExercises = async () => {
            try {
                // Extract exercise IDs from the workout and join them with commas
                const ids = workout.exercises.map((ex) => ex.exerciseId).join(",");
                console.log(ids)
                const response = await fetch(`http://localhost:5001/api/v1/exercises/by-ids?ids=${ids}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch exercise details");
                }

                const data = await response.json();
                console.log(data)
                setExerciseDetails(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, [workout]);

    if (!workout) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white p-6 rounded shadow-lg w-96">
                <div className="relative flex items-center gap-4 mb-2">
                    <h2 className="text-xl font-bold leading-none m-0">
                        {workout.title}
                    </h2>

                    <div className="ml-auto">
                        <EllipsisDropdown workout={workout} onDeleteSuccess={onDeleteSuccess} />
                    </div>
                </div>

                <p className="text-xs text-gray-600">{workout.description}</p>
                <p className="mt-4 text-sm font-medium">
                    {formatWorkoutDate(workout.dateTime)}
                </p>
                <p className="mt text-sm">
                    {formatWorkoutTime(workout.dateTime)}
                </p>

                {loading && <p className="mt-4 text-sm">Loading exercises...</p>}
                {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                {(!loading && exerciseDetails.length > 0) && (

                    <div className="mt-4">
                        <h3 className="text-md font-semibold mb-2">Exercises:</h3>
                        {exerciseDetails.map((ex) => {

                            const workoutExercise = workout.exercises.find(
                                (wEx) => wEx.exerciseId.toString() === ex._id.toString()
                            );
                            // Destructure quantity values
                            const { sets, reps, timeInMinutes, distanceInKm } = workoutExercise;
                            let quantityText = `${sets} sets x ${reps} reps`;
                            if (ex.sets != null && ex.reps != null) {
                                quantityText = `${ex.sets} sets x ${ex.reps} reps`;
                            } else if (timeInMinutes != null) {
                                quantityText = `${timeInMinutes} minutes`;
                            } else if (distanceInKm != null) {
                                quantityText = `${distanceInKm} km`;
                            }
                            return (
                                <div key={ex._id} className="flex items-start gap-2 mb-2">
                                    <img
                                        src={
                                            "http://localhost:5001/static/images/still/" +
                                            ex.exerciseImages[0].replace(".gif", ".png")
                                        }
                                        alt={ex.name}
                                        className="w-12 h-16 object-cover rounded"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{ex.name}</span>
                                        {quantityText && (
                                            <span className="text-xs text-gray-600">{quantityText}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                )}

                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 text-blue-500 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default WorkoutDetailModal;
