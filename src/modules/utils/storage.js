import { fileURLToPath } from 'url';
import path from 'path'
import multer from 'multer';
import { checkFileExec } from '../utils/checkFileExec.js';

/* const storage = (dest) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    return multer.diskStorage({
        destination: path.join(__dirname, '..', '..', '..', 'public', dest),
        filename: (req, file, callback) => {
            callback(null, file.originalname);
        }
    })
}

const upload = multer({
    storage: storage('forum'),
    fileFilter: (req, file, callback) => checkFileExec(file, callback),
    limits: { fields: 10, fileSize: 1048576 * 20 } // 20Mb
}).array('attach', 4) // 20 * 4 = 80Mb

export { storage, upload }; */

// SET CUSTOM NAME (ex: attach_1703689049071)
const storage = (dest, name) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    return multer.diskStorage({
        destination: path.join(__dirname, '..', '..', '..', 'public', dest),
        filename: (req, file, callback) => {
            callback(null, name + '_' + Date.now() + path.extname(file.originalname))
        }
    })
}

const upload = multer({
    storage: storage('forum', 'attach'),
    fileFilter: (req, file, callback) => checkFileExec(file, callback),
    limits: { fields: 10, fileSize: 1048576 * 20 } // 20Mb
}).array('attach', 4) // 20 * 4 = 80Mb

const singleUpload = multer({
    storage: storage('uploads', 'file'),
    fileFilter: (req, file, callback) => checkFileExec(file, callback),
    limits: { fields: 10, fileSize: 1048576 * 80 } // 80Mb
}).single('file')

const messageUpload = multer({
    storage: storage('message', 'file'),
    fileFilter: (req, file, callback) => checkFileExec(file, callback),
    limits: { fields: 1, fileSize: 1048576 * 24 } // 24Mb
}).array('file', 4) // 24 * 4 = 96Mb

export { storage, upload, singleUpload, messageUpload };
