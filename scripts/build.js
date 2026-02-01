// Simple build script for the extension
const fs = require('fs');
const path = require('path');

console.log('Building Claude extension...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy manifest
console.log('Copying manifest.json...');
fs.copyFileSync(
  path.join(__dirname, '..', 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Copy src directory
console.log('Copying source files...');
copyRecursive(
  path.join(__dirname, '..', 'src'),
  path.join(distDir, 'src')
);

// Copy icons directory
console.log('Copying icons...');
copyRecursive(
  path.join(__dirname, '..', 'icons'),
  path.join(distDir, 'icons')
);

console.log('Build complete! Extension ready in ./dist');

// Helper function to copy directories recursively
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
