/**
 * parseToDate
 * 
 * Converts a date string in "DD/MM/YYYY" format to a JavaScript Date object.
 * 
 * @param {string} dateString - The date string in "DD/MM/YYYY" format.
 * @returns {Date|null} - A JavaScript Date object, or null if the input is invalid.
 */
export const parseToDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
};

/**
 * formatDate
 * 
 * Converts a JavaScript Date object or an ISO date string to a string in "DD/MM/YYYY" format.
 * 
 * @param {Date|string} date - The JavaScript Date object or ISO date string to format.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') {
        date = new Date(date); // Parse ISO string to Date
    }
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return ''; // Return empty string for invalid Date
    }
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

// Helper function to add ordinal suffix to a day
function getOrdinal(day) {
    if (day > 3 && day < 21) return "th"; // covers 11th-13th
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

/**
 * formatWorkoutDate
 * 
 * Converts an ISO date string into a human-readable format with weekday, day + ordinal,
 * month, and year. Example: "Monday 4th March 2024".
 * 
 * @param {string} dateString - An ISO-formatted date string.
 * @returns {string} - Formatted string in long, readable form.
 */
export function formatWorkoutDate(dateString) {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    const ordinal = getOrdinal(day);
    // Format time as hour:minute with AM/PM
    const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
    });
    return `${weekday} ${day}${ordinal} ${month} ${year}`;
}

/**
 * formatWorkoutTime
 * 
 * Extracts and formats the time portion from an ISO date string in "HH:MM AM/PM" format.
 * 
 * @param {string} dateString - An ISO-formatted date string.
 * @returns {string} - The formatted time string.
 */
export function formatWorkoutTime(dateString) {
    const date = new Date(dateString);
    // Format time as hour:minute with AM/PM
    const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
    });
    return `${time}`;
}

