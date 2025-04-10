import React from "react";
import WorkoutCardButton from "./WorkoutCardButton";

function WorkoutsList({ workouts, handleWorkoutClick }) {
    return (
        <div className="space-y-2">
            {workouts.map((wk) => (
                <WorkoutCardButton
                    key={wk._id}
                    workout={wk}
                    onClick={() => handleWorkoutClick(wk._id)}
                />
            ))}
        </div>
    );
}

export default WorkoutsList;
