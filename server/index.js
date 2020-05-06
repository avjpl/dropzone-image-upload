require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const corsOptions = { origin: 'http://localhost:3000' };
const uploadFolder = process.env.uploadFolder;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}.jpg`);
  }
});

const upload = multer({ storage });

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.post('/upload', upload.single('fileUpload'), (req, res) => {
  const imageData = {
    image: `${uploadFolder}/${req.originalname}`,
    exif: JSON.parse(req.body.exifData),
  };
  console.log(imageData);

  res.json({ msg: 'Uploaded' });
});

app.use(function (err, req, res, next) {
  console.log('This is the invalid field ->', err.field);
  next(err);
});

app.listen(3001);
