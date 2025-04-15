const fs = require('fs');
const path = require('path');

// List of component directories to process
const componentDirs = [
  'src/components/ExamInterface',
  'src/components/auth',
  'src/components/common',
  'src/components/layout',
  'src/components/sections'
];

// Process each directory
componentDirs.forEach(dir => {
  // Get all subdirectories
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const components = items
    .filter(item => item.isDirectory())
    .map(item => item.name);
  
  // Create index.js files for each component
  components.forEach(component => {
    const componentDir = path.join(dir, component);
    const indexPath = path.join(componentDir, 'index.js');
    
    // Check if the component has a JSX file
    const jsxFiles = fs.readdirSync(componentDir)
      .filter(file => file.endsWith('.jsx') || file.endsWith('.js'))
      .filter(file => !file.includes('index'));
    
    if (jsxFiles.length > 0) {
      // Create index.js file
      const componentName = jsxFiles[0].replace(/\.(jsx|js)$/, '');
      const content = `export { default } from './${componentName}';\n`;
      fs.writeFileSync(indexPath, content);
      console.log(`Created index.js for ${componentName}`);
    }
  });
  
  // Create barrel file for the directory
  const barrelPath = path.join(dir, 'index.js');
  let barrelContent = '';
  
  components.forEach(component => {
    barrelContent += `export { default as ${component} } from './${component}';\n`;
  });
  
  fs.writeFileSync(barrelPath, barrelContent);
  console.log(`Created barrel file for ${dir}`);
});