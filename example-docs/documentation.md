# Easydox

Easydox - Automate your JavaScript/TypeScript project documentation with ease.

This library provides essential JavaScript utilities for common programming tasks. Designed for simplicity and efficiency, it offers functions for numerical operations, string formatting, geometry calculations, API interactions, and logging.

## Key Features

- **Sum Calculation**: Adds two numeric values with precision
- **Text Formatting**: Converts strings to title case by capitalizing each word
- **Geometric Computation**: Calculates rectangle area from width and height dimensions
- **Data Retrieval**: Asynchronously fetches JSON data from APIs
- **Debug Utilities**: Timestamped console logging with debug mode flagging

## Sum

Adds two numbers together.

### Props

| Name  |   Type   | Description               |
| :---- | :------: | :------------------------ |
| **a** | `number` | The first number to add.  |
| **b** | `number` | The second number to add. |

### Returns

- Type: `number`
- Description: The sum of both numbers.

### Code Example

```js
(a, b) => a + b;
```

---

## To Title Case

Capitalizes the first letter of every word in a string.

### Props

| Name     |   Type   | Description       |
| :------- | :------: | :---------------- |
| **text** | `string` | The input string. |

### Returns

- Type: `string`
- Description: The title-cased string.

### Code Example

```js
function toTitleCase(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

---

## Get Rectangle Area

Calculates the area of a rectangle.

### Props

| Name       |   Type   | Description                  |
| :--------- | :------: | :--------------------------- |
| **width**  | `number` | The width of the rectangle.  |
| **height** | `number` | The height of the rectangle. |

### Returns

- Type: `number`
- Description: The area of the rectangle.

### Code Example

```js
function getRectangleArea(width, height) {
  return width * height;
}
```

---

## Fetch Data

Fetches data from a given API URL.

### Props

| Name    |   Type   | Description                          |
| :------ | :------: | :----------------------------------- |
| **url** | `string` | The API endpoint to fetch data from. |

### Returns

- Type: `Promise.<Object>`
- Description: A promise that resolves to the JSON response.

### Code Example

```js
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}
```

---

## Log Message

Logs a message with a timestamp.

### Props

| Name        |   Type    | Description                   |
| :---------- | :-------: | :---------------------------- |
| **message** | `string`  | The message to log.           |
| **debug**   | `boolean` | Whether to log in debug mode. |

### Returns

- Type: `void`
- Description: No description

### Code Example

```js
function logMessage(message, debug = false) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${debug ? '[DEBUG]' : ''} ${message}`);
}
```

---
