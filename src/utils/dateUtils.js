/**
 * Date and time formatting utilities
 */

/**
 * Ensures the date is treated as UTC if it's an ISO string without timezone
 * @param {string|Date} dateString 
 * @returns {Date}
 */
export const normalizeToUtc = (dateString) => {
    if (!dateString) return null;
    if (dateString instanceof Date) return dateString;

    // If it's an ISO string without timezone indicator (no Z, no +/- offset), append Z
    if (typeof dateString === 'string' && dateString.includes('T') && !dateString.includes('Z') && !/[+-]\d{2}:?\d{2}$/.test(dateString)) {
        return new Date(dateString + 'Z');
    }
    return new Date(dateString);
};

/**
 * Format date to Vietnam timezone (UTC+7) and Vietnamese format
 * @param {string|Date} dateString - Date string or Date object to format
 * @returns {string} Formatted date string in format: DD/MM/YYYY HH:mm
 */
export const formatToVietnamTime = (dateString) => {
    try {
        const utcDate = normalizeToUtc(dateString);
        if (!utcDate || isNaN(utcDate.getTime())) return dateString;

        // Add 7 hours (in milliseconds) for Vietnam timezone
        const date = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));

        // Use UTC methods to get the correct date/time components
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        return dateString;
    }
};

/**
 * Format date to Vietnam timezone with seconds
 * @param {string|Date} dateString - Date string or Date object to format
 * @returns {string} Formatted date string in format: DD/MM/YYYY HH:mm:ss
 */
export const formatToVietnamTimeWithSeconds = (dateString) => {
    try {
        const utcDate = normalizeToUtc(dateString);
        if (!utcDate || isNaN(utcDate.getTime())) return dateString;

        const date = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
        return dateString;
    }
};

/**
 * Format date to Vietnam timezone (date only)
 * @param {string|Date} dateString - Date string or Date object to format
 * @returns {string} Formatted date string in format: DD/MM/YYYY
 */
export const formatToVietnamDate = (dateString) => {
    try {
        const utcDate = normalizeToUtc(dateString);
        if (!utcDate || isNaN(utcDate.getTime())) return dateString;

        const date = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    } catch (error) {
        return dateString;
    }
};
