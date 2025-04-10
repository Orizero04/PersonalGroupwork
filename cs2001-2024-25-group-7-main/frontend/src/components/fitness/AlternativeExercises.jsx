import React, { useEffect, useState } from "react";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const AlternativeExercises = ({ primaryMuscle, muscleName, currentExerciseId }) => {
    const [alternatives, setAlternatives] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 2;

    const fetchAlternatives = async () => {
        try {
            const res = await fetch(
                `http://localhost:5001/api/v1/exercises/alternatives?primaryMuscle=${primaryMuscle}&currentExerciseId=${currentExerciseId}`
            );
            const data = await res.json();
            setAlternatives(data.data || []);
            setCurrentIndex(0);
        } catch (err) {
            console.error("Failed to fetch alternatives:", err);
        }
    };

    useEffect(() => {
        if (primaryMuscle) {
            fetchAlternatives();
        }
    }, [primaryMuscle, currentExerciseId]);

    const scrollRight = () => {
        if (currentIndex < alternatives.length - visibleCount) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const scrollLeft = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium">
                    Alternative {muscleName} Exercises
                </h2>
                <div className="flex gap-2">
                    <button onClick={scrollLeft} disabled={currentIndex === 0}>
                        <ArrowLeftCircleIcon className={`h-6 w-6 ${currentIndex === 0 ? "text-gray-400" : "text-gray-700"}`} />
                    </button>
                    <button
                        onClick={scrollRight}
                        disabled={currentIndex >= alternatives.length - visibleCount}
                    >
                        <ArrowRightCircleIcon className={`h-6 w-6 ${currentIndex >= alternatives.length - visibleCount ? "text-gray-400" : "text-gray-700"}`} />
                    </button>
                </div>
            </div>
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500 "
                    style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
                >
                    {alternatives.map((exercise) => (
                        <div key={exercise._id} className="w-1/2 flex-shrink-0 px-2">
                            <Link to={`/exercises/${exercise._id}`} key={exercise._id} className="w-1/2 flex-shrink-0">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                                    <img
                                        src={`http://localhost:5001/static/images/still/${exercise.exerciseImages?.[0]?.replace(".gif", ".png")}`}
                                        alt={exercise.name}
                                        className="w-full h-36 object-cover"
                                    />
                                    <div className="p-2 text-center bg-gray-200">
                                        <p className="text-sm font-medium">{exercise.name}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlternativeExercises;
