import React from "react";
import { ChevronDownIcon } from '@heroicons/react/24/outline';

function ExerciseQuantitySelector({ logType = {}, values, onChange }) {
  // Dropdown options
  const setsOptions = Array.from({ length: 10 }, (_, i) => i + 1); // 1..10
  const repsOptions = Array.from({ length: 30 }, (_, i) => i + 1); // 1..30
  const timeOptions = [0.5, 1, 5, 10, 15, 20, 25, 30];
  const distanceOptions = [0.5, 1, 2, 3, 4, 5, 10, 15, 20];

  return (
    <div className="mt-2 flex items-center gap-4">
      {logType === "setsAndReps" && (
        <>
          {/* Sets */}
          <div className="flex items-center gap-1">
            <label className="text-sm text-gray-600">Sets:</label>
            <div className="relative w-14">
              <select
                className="block appearance-none w-full border p-1 rounded bg-white text-gray-700 focus:outline-none focus:border-gray-400 text-xs"
                value={values.sets}
                onChange={(e) =>
                  onChange({ ...values, sets: Number(e.target.value) })
                }
              >
                {setsOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Reps */}
          <div className="flex items-center gap-1">
            <label className="text-sm text-gray-600">Reps:</label>
            <div className="relative w-14">
              <select
                className="block appearance-none w-full border p-1 rounded bg-white text-gray-700 focus:outline-none focus:border-gray-400 text-xs"
                value={values.reps}
                onChange={(e) =>
                  onChange({ ...values, reps: Number(e.target.value) })
                }
              >
                {repsOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </>
      )}

      {logType === "time" && (
        <div className="flex items-center gap-1">
          <label className="text-sm text-gray-600">Time (min):</label>
          <div className="relative w-14">
            <select
              className="block appearance-none w-full border p-2 rounded bg-white text-gray-700 focus:outline-none focus:border-gray-400 text-xs"
              value={values.timeInMinutes}
              onChange={(e) =>
                onChange({ ...values, timeInMinutes: Number(e.target.value) })
              }
            >
              {timeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      )}

      {logType === "distance" && (
        <div className="flex items-center gap-1">
          <label className="text-sm text-gray-600">Distance (km):</label>
          <div className="relative w-14">
            <select
              className="block appearance-none w-full border p-2 rounded bg-white text-gray-700 focus:outline-none focus:border-gray-400 text-xs"
              value={values.distanceInKm}
              onChange={(e) =>
                onChange({ ...values, distanceInKm: Number(e.target.value) })
              }
            >
              {distanceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExerciseQuantitySelector;

