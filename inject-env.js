// inject-env.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env variables
dotenv.config();

// Get the API key
const apiKey = process.env.OPEN_ROUTER_API_KEY;
if (!apiKey) {
  console.error('❌ OPEN_ROUTER_API_KEY is not defined in .env');
  process.exit(1);
}

// Path to dist file
const filePath = path.resolve(__dirname, 'dist/lib/openaiconfig.js');

// Read the compiled file
let fileContent = fs.readFileSync(filePath, 'utf-8');

// Replace the placeholder
fileContent = fileContent.replace(
  /process\.env\.OPEN_ROUTER_API_KEY/g,
  `"${apiKey}"`
);

// Write back to file
fs.writeFileSync(filePath, fileContent);

console.log('✅ Environment variable injected successfully!');
