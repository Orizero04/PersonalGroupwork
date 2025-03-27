import React from "react";
import { TrashIcon } from '@heroicons/react/24/outline';
import ExerciseQuantitySelector from "./ExerciseQuantitySelector";

function ExerciseListItem({ imageUrl, title, description, logType, recommendedAmount, muscles, quantityValues, onChangeQuantity, onRemove }) {

    return (
        <div className="flex gap-4 mb-4">

            {/* Image Container */}
            <div className="w-24 h-32 overflow-hidden rounded-md flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={title}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Exercise Details */}
            <div className="text-left flex-1 flex flex-col">
                <h1 className="font-medium" >{title}</h1>
                <p className="text-xs text-gray-500">{description}</p>

                <div className="flex-grow"></div>
                
                {/* Pass controlled props to quantity selector */}
                <ExerciseQuantitySelector
                    logType={logType}
                    values={quantityValues}
                    onChange={onChangeQuantity}
                />
            </div>

            <button onClick={onRemove}>
                <TrashIcon className="h-4 w-4 ml-2 text-red-600" />
            </button>

        </div>
    );

}

export default ExerciseListItem;
