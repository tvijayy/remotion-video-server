const express = require('express');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3000;
const OUTPUT_DIR = '/tmp/videos';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Remotion video server is running',
    timestamp: new Date().toISOString()
  });
});

// Main render endpoint
app.post('/render', async (req, res) => {
  console.log('Received render request:', req.body);
  
  try {
    const { videoUrl, caption, scriptText } = req.body;

    // Validate inputs
    if (!videoUrl) {
      return res.status(400).json({ 
        error: 'Missing videoUrl parameter' 
      });
    }

    if (!caption) {
      return res.status(400).json({ 
        error: 'Missing caption parameter' 
      });
    }

    console.log('Starting video render...');
    console.log('Video URL:', videoUrl);
    console.log('Caption:', caption);

    // Bundle the Remotion project
    console.log('Bundling Remotion project...');
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, 'src/index.js'),
      webpackOverride: (config) => config,
    });
    console.log('Bundle created at:', bundleLocation);

    // Select composition
    console.log('Selecting composition...');
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'SocialMediaVideo',
      inputProps: {
        videoUrl,
        caption,
        scriptText: scriptText || caption,
      },
    });
    console.log('Composition selected:', composition.id);

    // Generate output filename
    const outputFilename = `video_${Date.now()}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    // Render the video
    console.log('Rendering video...');
    await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: outputPath,
  inputProps: { videoUrl, caption, scriptText },
  chromiumOptions: {
    executablePath: '/usr/bin/chromium', // Use system Chromium
  },
  onProgress: ({ progress }) => {
    console.log(`Render progress: ${Math.round(progress * 100)}%`);
  },
});

    console.log('Video rendered successfully at:', outputPath);

    // Check if file exists and get size
    const stats = fs.statSync(outputPath);
    console.log('Video file size:', stats.size, 'bytes');

    // Return success response
    // Note: In production, you'd upload this to cloud storage (S3, Google Cloud Storage, etc.)
    // For now, we return the local path
    res.json({
      success: true,
      message: 'Video rendered successfully',
      videoPath: outputPath,
      videoFilename: outputFilename,
      fileSizeBytes: stats.size,
      note: 'Video is stored temporarily. Upload to cloud storage for permanent hosting.'
    });

  } catch (error) {
    console.error('Render error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ========================================
  🎬 Remotion Video Server Started
  ========================================
  Port: ${PORT}
  Time: ${new Date().toISOString()}
  Environment: ${process.env.NODE_ENV || 'production'}
  ========================================
  `);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
