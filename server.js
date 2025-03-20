const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));

// Simpan foto di memory (RAM)
const photos = {};

// Terima upload foto
app.post('/upload', (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ status: false, msg: 'No image data' });

  const hash = 'photo_' + Date.now();
  photos[hash] = image;
  console.log('Foto diterima:', hash);

  res.json({ status: true, url: `${req.protocol}://${req.get('host')}/capture/${hash}.jpeg` });
});

// Serve foto sebagai image/jpeg
app.get('/capture/:hash.jpeg', (req, res) => {
  const hash = req.params.hash;
  const base64 = photos[hash];
  if (!base64) return res.status(404).send('Foto tidak ditemukan');

  const img = Buffer.from(base64.split(',')[1], 'base64');
  res.set('Content-Type', 'image/jpeg');
  res.send(img);
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
