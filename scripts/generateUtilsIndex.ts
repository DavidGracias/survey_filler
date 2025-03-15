import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const utilsDir = path.join(__dirname, '../src/constants/util');
  const indexFile = path.join(utilsDir, 'index.ts');

  // Create utils directory if it doesn't exist
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }

  // Get all .ts files in the utils directory
  const files = fs.readdirSync(utilsDir)
    .filter(file => file.endsWith('.ts'))
    .filter(file => file !== 'index.ts');

  // Generate export statements
  const exports = files
    .map(file => `export * from './${path.parse(file).name}';`)
    .join('\n');

  // Write the index file
  fs.writeFileSync(indexFile, exports + '\n');

  console.log('Utils index file generated successfully!');
} catch (error) {
  console.error('Error generating utils index:', error);
  process.exit(1);
} 