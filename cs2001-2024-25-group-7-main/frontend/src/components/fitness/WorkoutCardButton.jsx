import React from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

function WorkoutCardButton({ workout, onClick }) {
    // Parse the workout date
    const dateObj = new Date(workout.dateTime);
    const day = dateObj.getDate();
    const monthName = dateObj.toLocaleString("default", { month: "long" });

    return (
        <button
            onClick={onClick}
            className="w-full flex items-start p-3 rounded-md bg-white hover:bg-gray-50 transition-colors text-left border border-gray-100"
        >
            {/* Date Block */}
            <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary rounded">
                <span className="text-lg font-bold text-white">{day}</span>
                <span className="text-xs text-white">{monthName}</span>
            </div>

            {/* Workout Details */}
            <div className="ml-4 flex-1">
                <h2 className="text-sm font-semibold">{workout.title}</h2>
                <p className="text-xs text-gray-500 line-clamp-2">
                    {workout.description}
                </p>
            </div>
        </button>
    );
}

export default WorkoutCardButton;
