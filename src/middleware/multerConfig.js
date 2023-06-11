
const multer = require('multer');
const path = require('path');

// Setting storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/img'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initializing multer with the storage engine
const upload = multer({
  storage
});

module.exports = upload;
