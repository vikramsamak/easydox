import path from 'path';
import fs from 'fs';

export function writeFile(
  outputDir: string,
  fileName: string,
  content: string
) {
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`📄 Documentation generated: ${filePath}`);
}
