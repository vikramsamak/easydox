/**
 * Adds two numbers together.
 *
 * @param {number} a - The first number to add.
 * @param {number} b - The second number to add.
 * @returns {number} The sum of both numbers.
 */
const sum = (a, b) => a + b;

/**
 * Capitalizes the first letter of every word in a string.
 *
 * @param {string} text - The input string.
 * @returns {string} The title-cased string.
 */
function toTitleCase(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Calculates the area of a rectangle.
 *
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @returns {number} The area of the rectangle.
 */
function getRectangleArea(width, height) {
  return width * height;
}

/**
 * Fetches data from a given API URL.
 *
 * @param {string} url - The API endpoint to fetch data from.
 * @returns {Promise<Object>} A promise that resolves to the JSON response.
 */
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

/**
 * Logs a message with a timestamp.
 *
 * @param {string} message - The message to log.
 * @param {boolean} [debug=false] - Whether to log in debug mode.
 * @returns {void}
 */
function logMessage(message, debug = false) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${debug ? '[DEBUG]' : ''} ${message}`);
}
