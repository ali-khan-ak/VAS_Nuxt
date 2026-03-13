/**
 * server-middleware/uploadLogo.js
 *
 * Handles logo upload — saves the file as brand_logo.<ext> in /static/img/
 * replacing whatever was there before.
 *
 * Endpoint:
 *   POST /api/upload-logo   – saves file as /static/img/brand_logo.<ext>
 *
 * Register in nuxt.config.js:
 *   serverMiddleware: [
 *     { path: '/api/upload-logo', handler: '~/server-middleware/uploadLogo.js' },
 *   ]
 *
 * Requires: npm install multer
 */

const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const express = require('express');

const app = express();

// ── Points to /static/img/ ────────────────────────────────────────────────
const staticDir = path.resolve(__dirname, '..', 'static', 'img');

// ── Allowed MIME types ────────────────────────────────────────────────────
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];

// ── Multer: memory storage so we control the filename ────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter(req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, JPG and SVG files are allowed.'));
    }
  },
});

// ── Helper: delete any existing brand_logo.* files ───────────────────────
function clearExistingLogo() {
  ['png', 'jpg', 'jpeg', 'svg'].forEach(ext => {
    const p = path.join(staticDir, `brand_logo.${ext}`);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });
}

// ── POST /api/upload-logo ─────────────────────────────────────────────────
app.post('/', upload.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file received.' });
    }

    const extMap = {
      'image/png':     'png',
      'image/jpeg':    'jpg',
      'image/svg+xml': 'svg',
    };

    const ext      = extMap[req.file.mimetype];
    const filename = `brand_logo.${ext}`;
    const destPath = path.join(staticDir, filename);

    // Remove any old brand_logo.* then save the new one
    clearExistingLogo();
    fs.writeFileSync(destPath, req.file.buffer);

    return res.json({
      success:  true,
      message:  'Logo uploaded successfully.',
      filename,
      url: `/img/${filename}?t=${Date.now()}`, // cache-bust so browser reloads it
    });

  } catch (err) {
    console.error('[uploadLogo]', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = app;