import { PlusCircleIcon } from '@heroicons/react/24/outline';

function SelectExerciseListItem({ imageUrl, title, description, muscles, onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex gap-4 p-3 rounded-md transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
        >
            {/* Image Container */}
            <div className="w-24 h-28 overflow-hidden rounded-md flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={title}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Exercise Details */}
            <div className="text-left flex-1 flex flex-col">
                <h1 className="font-medium">{title}</h1>
                <p className="text-xs text-gray-500 line-clamp-3">{description}</p>

                {/* Muscles always at the bottom */}
                <div className="flex gap-2 mt-auto mb-1">
                    {(muscles || []).map((muscle, index) => (
                        <span key={index} className="text-xs text-blue-800 font-semibold bg-blue-100 px-2 py-1 rounded">
                            {muscle.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Icon (for visual cue) */}
            <div className="flex items-center">
                <PlusCircleIcon className="h-4 w-4 text-blue-600" />
            </div>
        </div>
    );
}

export default SelectExerciseListItem;
