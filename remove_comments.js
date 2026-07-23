// Script to remove HTML comments from component files
const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const files = fs.readdirSync(componentsDir).filter(file => file.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  
  // Also remove empty lines that might result from comment removal
  content = content.replace(/\n\s*\n/g, '\n\n').trim();
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
});

console.log('All component files processed.');