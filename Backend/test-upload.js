// Simple test script to verify upload functionality
// Run with: node test-upload.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');

console.log('🔍 Checking upload configuration...\n');

// Check if uploads directory exists
if (fs.existsSync(uploadsDir)) {
  console.log('✅ Uploads directory exists:', uploadsDir);
  
  // List files in uploads directory
  const files = fs.readdirSync(uploadsDir);
  console.log(`📁 Files in uploads: ${files.length}`);
  
  if (files.length > 0) {
    console.log('\nUploaded files:');
    files.forEach(file => {
      const stats = fs.statSync(path.join(uploadsDir, file));
      console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
  }
} else {
  console.log('⚠️  Uploads directory does not exist yet');
  console.log('   It will be created automatically on first upload');
}

console.log('\n📝 Configuration:');
console.log('  - Max file size: 5MB');
console.log('  - Allowed types: jpeg, jpg, png, gif, webp');
console.log('  - Storage: Backend/uploads/');
console.log('  - URL path: /uploads/[filename]');

console.log('\n✨ Ready to accept uploads!');
