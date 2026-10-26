import fs from 'node:fs';
import path from 'node:path';
import strip from 'strip-comments';

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      const code = fs.readFileSync(fullPath, 'utf8');
      const cleanCode = strip(code);
      fs.writeFileSync(fullPath, cleanCode, 'utf8');
    } else if (entry.name.endsWith('.css')) {
      const code = fs.readFileSync(fullPath, 'utf8');
      const cleanCss = code.replace(/\/\*[\s\S]*?\*\//g, '');
      fs.writeFileSync(fullPath, cleanCss, 'utf8');
    }
  }
}

processDirectory(path.resolve('src'));
console.log('✅ Все комментарии в директории src успешно удалены.');