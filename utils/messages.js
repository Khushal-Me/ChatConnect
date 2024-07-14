// Dependencies
const moment = require('moment-timezone'); // Require moment-timezone for handling date and time

/**
 * Format a message object
 * @param {string} username - The username of the sender
 * @param {string} text - The message text
 * @returns {Object} - Formatted message object with username, text, and timestamp
 */
function formatMessage(username, text) {
    return {
        username, // Username of the sender
        text, // Message text
        time: moment().tz('America/Los_Angeles').format('h:mm a'), // Timestamp formatted to 'h:mm a' in the specified timezone
    };
}

module.exports = formatMessage; // Export the formatMessage function
