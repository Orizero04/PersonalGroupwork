import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useWorkouts } from "../../hooks/useWorkouts";
import WorkoutsList from "./WorkoutsList";
import WorkoutDetailModal from "./WorkoutDetailModal";

function WorkoutSidebar() {

    const { workouts, refetch } = useWorkouts();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(true);

    // Called when user selects a day on the calendar
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const filteredWorkouts = workouts.filter((workout) => {
        const workoutDate = new Date(workout.dateTime);
        return (
            workoutDate.getFullYear() === selectedDate.getFullYear() &&
            workoutDate.getMonth() === selectedDate.getMonth() &&
            workoutDate.getDate() === selectedDate.getDate()
        );
    });

    const handleWorkoutClick = (id) => {
        const workout = workouts.find((wk) => wk._id === id);
        setSelectedWorkout(workout);
        setIsWorkoutModalOpen(true);
    };

    const nextThreeWorkouts = workouts
        .filter((workout) => {
            const workoutDate = new Date(workout.dateTime);
            const now = new Date();
            return workoutDate > now;
        })
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        .slice(0, 3);

    const handleDeleteSuccess = () => {
        refetch(); // Refresh the workouts list
        setIsWorkoutModalOpen(false); 
    };


    return (
        <div className="w-72 bg-white p-4 shadow-md">

            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileContent={({ date, view }) => {
                    // Only add content for month view
                    if (view === "month") {
                        // Check if any workout in your workouts array is scheduled for this date
                        const hasWorkout = workouts.some((workout) => {
                            const workoutDate = new Date(workout.dateTime);
                            return (
                                workoutDate.getFullYear() === date.getFullYear() &&
                                workoutDate.getMonth() === date.getMonth() &&
                                workoutDate.getDate() === date.getDate()
                            );
                        });

                        // If there's a workout, render a dot underneath the tile
                        return hasWorkout ? (
                            <div className="flex justify-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <div className="w-2 h-2 mt-1"></div>
                            </div>
                        );
                    }
                    return null;
                }}
            />


            {/* Selected Day's Workout Button */}
            <div className="mt-4 flex flex-col">

                <WorkoutsList workouts={filteredWorkouts} handleWorkoutClick={handleWorkoutClick} />
            </div>

            <h3 className="mt-4">Upcoming Workouts</h3>

            {/* Selected Day's Workout Button */}
            <div className="flex flex-col mt-1">
                {nextThreeWorkouts.length > 0 ? (
                    <WorkoutsList workouts={nextThreeWorkouts} handleWorkoutClick={handleWorkoutClick} />
                ) : (
                    <div>
                        <p className="text-sm text-gray-500 text-center mt-4">No scheduled workouts</p>
                    </div>

                )}
            </div>

            {isWorkoutModalOpen && (
                <WorkoutDetailModal
                    workout={selectedWorkout}
                    onClose={() => setIsWorkoutModalOpen(false)}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}
        </div>
    );
}

export default WorkoutSidebar;