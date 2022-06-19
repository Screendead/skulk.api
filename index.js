const admin = require('firebase-admin');
const express = require('express');

const serviceAccount = require('./secrets/a-fox-like-me-firebase-adminsdk-w09a1-fdb7897d95.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const storage = admin.storage();
const bucket = storage.bucket('a-fox-like-me.appspot.com');

const app = express();

function logout(req, res, next) {
  console.log('Request:', req.method, req.url);
  next();
}

app.use([
  express.json(),
  logout,
]);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello, skulk.dev API',
  });
});

app.get('/v1/', (req, res) => {
  res.status(200).json({
    message: 'Hello, skulk.dev API v1',
  });
});

app.get('/v1/foxes/:foxID/thumbnails/:fileType/:size', async (req, res) => {
  const thumbSizes = [
    '30x30', '32x32',
    '60x60', '64x64',
    '120x120', '128x128',
    '240x240', '256x256',
    '300x300',
  ];
  const fileTypes = [
    'jpeg', 'webp',
  ];

  const { foxID, fileType, size } = req.params;

  if (!thumbSizes.includes(size)) {
    res.status(400).json({
      message: 'Invalid size',
      details: `Valid sizes are: ${thumbSizes.join(', ')}`,
    });
    return;
  }

  if (!fileTypes.includes(fileType)) {
    res.status(400).json({
      message: 'Invalid file type',
      details: `Valid file types are: ${fileTypes.join(', ')}`,
    });
    return;
  }

  try {
    const fileName = `${foxID}_${size}.${fileType}`;
    const file = bucket.file(`foxes/thumbnails/${fileName}`);

    const [exists] = await file.exists();

    if (!exists) {
      res.status(404).json({
        message: 'File not found',
      });
      return;
    }

    const [metadata] = await file.getMetadata();

    res.set('Content-Type', metadata.contentType);
    res.set('Cache-Control', 'public, max-age=31536000');
    res.set('Expires', new Date(Date.now() + 31536000).toUTCString());

    const readStream = file.createReadStream();
    readStream.pipe(res);

    readStream.on('error', (err) => {
      console.error(err);
      res.status(500).json({
        message: 'Internal server error',
      });
    });

    readStream.on('end', () => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(80, () => {
  console.log('App listening on port 80!');
});
