import Multer from 'multer';
import path from 'path';

const loader = Multer({
  dest: path.join(__dirname, 'tmp'),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.mp3') {
      cb(null, false);
      // throw new Error('File type is not supported');
    }
    cb(null, true);
  },
});

export default loader;
