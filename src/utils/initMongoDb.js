
// Simple script to initialize the MongoDB database
// Run this with: node src/utils/initMongoDb.js

// Import required modules
const path = require('path');
require('esbuild-register')({
  target: 'es2020',
});

// Now we can import our TypeScript file
const initDb = require('./initDb').default;

// Run the initialization
console.log('Starting MongoDB initialization...');
initDb()
  .then(() => {
    console.log('MongoDB initialization complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB initialization failed:', err);
    process.exit(1);
  });
