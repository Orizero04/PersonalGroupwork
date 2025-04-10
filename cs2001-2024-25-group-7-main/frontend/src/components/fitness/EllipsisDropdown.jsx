import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const EllipsisDropdown = ({ workout, onDeleteSuccess }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Delete the workout using the API
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5001/api/v1/workouts/${workout._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();

            if (!response.ok) {
                console.error("Error deleting workout:", data.error);
            } else {
                // Optionally notify parent component of successful deletion
                if (onDeleteSuccess) {
                    onDeleteSuccess(workout._id);
                }
            }
        } catch (error) {
            console.error("Error deleting workout:", error);
        }
    };

    return (
        <div className="relative">

            {/* Ellipsis Button */}
            <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center justify-center"
            >
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-10"
                >
                    <Link
                        to={`/workout?editId=${workout._id}`}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        <PencilSquareIcon className="h-4 w-4 mr-2" />
                        Edit
                    </Link>
                    <button
                        onClick={async () => {
                            setIsDropdownOpen(false);
                            await handleDelete();
                        }}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 text-sm"
                    >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default EllipsisDropdown;
