# 📄 Project Overview

Title: UI Component Library Overview

This UI Component Library is a collection of essential utility functions designed to streamline the development process and enhance the user interface of applications. The library consists of the following components:

1. Sum: A utility function that takes an array of numbers as input and returns the sum of the elements in the array. This component is useful for performing calculations quickly and efficiently.

2. toTitleCase: A string manipulation function that converts the first letter of each word in a string to uppercase, while keeping the rest of the letters in lowercase. This component is useful for formatting text in a consistent and professional manner.

3. getRectangleArea: A function that calculates the area of a rectangle given its width and height. This component is useful for handling geometric calculations related to rectangular shapes.

4. fetchData: A utility function that retrieves data from an external source, such as an API or a database. This component simplifies the process of fetching data and makes it easier to integrate data into your application.

5. logMessage: A function that logs a message to the console. This component is useful for debugging purposes, as it allows developers to easily view and troubleshoot issues during the development process.

By utilizing these components, developers can create more efficient, user-friendly, and maintainable applications with ease. The UI Component Library aims to provide a comprehensive set of tools that cater to various development needs, ultimately saving time and effort in the development process.

# Autodocs

CLI Based tool to automate docs generation.

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
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
  console.log(`[${time}] ${debug ? "[DEBUG]" : ""} ${message}`);
}
```

---
