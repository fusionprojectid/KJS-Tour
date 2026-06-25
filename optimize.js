const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const EXCLUDED_DIRS = ['node_modules', '.git', '.github', 'css', 'fonts', 'js'];
const EXCLUDED_FILES = [
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'logo-kjs-terang.png',
  'logo-kjs.png'
];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const TEXT_EXTENSIONS = ['.html', '.css', '.js'];

// Helpers
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!EXCLUDED_DIRS.includes(f)) {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

// 1. Minify CSS helper
function minifyCSS(content) {
  let css = content.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove comments
  css = css.replace(/\s*([\{\}:;,])\s*/g, '$1');     // Remove spacing around selectors and rules
  css = css.replace(/\s+/g, ' ');                     // Collapse multiple spaces
  return css.trim();
}

console.log('--- Starting Asset Optimization ---');

// Check if cwebp is available
let hasCwebp = false;
try {
  execSync('cwebp -version', { stdio: 'ignore' });
  hasCwebp = true;
  console.log('cwebp is available in system path.');
} catch (e) {
  // Try local scratch path if running locally on this machine
  const localCwebp = 'C:\\Users\\fusionproject.id\\.gemini\\antigravity-ide\\scratch\\libwebp_extracted\\libwebp-1.4.0-windows-x64\\bin\\cwebp.exe';
  if (fs.existsSync(localCwebp)) {
    hasCwebp = true;
    global.cwebpPath = `"${localCwebp}"`;
    console.log(`Using local cwebp binary at: ${localCwebp}`);
  } else {
    console.warn('Warning: cwebp is not installed or not in PATH. Image conversion will be skipped.');
  }
}

const cwebpCmd = global.cwebpPath || 'cwebp';

// Collect all text files where we need to replace image references
const textFiles = [];
walkDir('.', (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (TEXT_EXTENSIONS.includes(ext)) {
    textFiles.push(filePath);
  }
});

// Track conversions: original base name (e.g. 'sandur.webp') -> webp name ('sandur.webp')
const conversions = {};

// Find and convert images
walkDir('.', (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath);
  
  if (IMAGE_EXTENSIONS.includes(ext) && !EXCLUDED_FILES.includes(base)) {
    const webpPath = filePath.substring(0, filePath.length - ext.length) + '.webp';
    const webpBase = path.basename(webpPath);
    
    if (hasCwebp) {
      console.log(`Converting image: ${filePath} -> ${webpPath}`);
      try {
        execSync(`${cwebpCmd} -q 85 "${filePath}" -o "${webpPath}"`);
        if (fs.existsSync(webpPath) && fs.statSync(webpPath).size > 0) {
          // Success! Add to conversions map and delete original file
          conversions[base] = webpBase;
          fs.unlinkSync(filePath);
          console.log(`Successfully converted and deleted original: ${filePath}`);
        } else {
          console.error(`Failed to convert ${filePath}: Output file is empty.`);
        }
      } catch (err) {
        console.error(`Error converting ${filePath}:`, err.message);
      }
    } else {
      console.log(`Skipping conversion for ${filePath} (cwebp not available).`);
    }
  }
});

// Update image references in all text files (HTML, CSS, JS)
const conversionKeys = Object.keys(conversions);
if (conversionKeys.length > 0) {
  console.log('\nUpdating image references in text files...');
  textFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let updated = false;
    
    conversionKeys.forEach(origName => {
      const destName = conversions[origName];
      // Escape special regex chars in filename
      const escapedOrig = origName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(escapedOrig, 'gi');
      
      if (regex.test(content)) {
        content = content.replace(regex, destName);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated references in: ${file}`);
    }
  });
} else {
  console.log('\nNo image conversions performed. No reference updates needed.');
}

// 2. CSS Minification
console.log('\nProcessing CSS files...');
const cssFiles = [];
walkDir('css', (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath);
  if (ext === '.css' && !base.endsWith('.min.css') && base !== 'bootstrap.css' && base !== 'bootstrap-icons.css') {
    cssFiles.push(filePath);
  }
});

const cssReplacements = {};
cssFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const minified = minifyCSS(content);
  
  const ext = path.extname(file);
  const minifiedFile = file.substring(0, file.length - ext.length) + '.min.css';
  
  fs.writeFileSync(minifiedFile, minified, 'utf8');
  console.log(`Minified: ${file} -> ${minifiedFile}`);
  
  // Track replacement: e.g. 'css/style.css' -> 'css/style.min.css'
  const originalRelPath = file.replace(/\\/g, '/');
  const minifiedRelPath = minifiedFile.replace(/\\/g, '/');
  cssReplacements[originalRelPath] = minifiedRelPath;
});

// Update HTML files to reference the minified CSS files
const cssKeys = Object.keys(cssReplacements);
if (cssKeys.length > 0) {
  console.log('\nUpdating CSS links in HTML files...');
  textFiles.forEach(file => {
    if (path.extname(file).toLowerCase() === '.html') {
      let content = fs.readFileSync(file, 'utf8');
      let updated = false;
      
      cssKeys.forEach(origPath => {
        const destPath = cssReplacements[origPath];
        
        // Escape special chars
        const escapedOrig = origPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Match either the original or an already minified path to make it idempotent
        const escapedDest = destPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        
        const regex = new RegExp(`href=["']\\.?/?(${escapedOrig}|${escapedDest})["']`, 'gi');
        
        if (regex.test(content)) {
          content = content.replace(regex, `href="${destPath}"`);
          updated = true;
        }
      });
      
      if (updated) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated CSS links in: ${file}`);
      }
    }
  });
}

console.log('\n--- Optimization Process Completed Successfully ---');
