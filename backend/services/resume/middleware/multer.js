import fs from "fs"
import multer from "multer"

const uploadPath = "../uploads"

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type. Only PDF files are allowed.'), false)
    }
}

export const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 20 * 1024 * 1024 } }) // Limit file size to 20MB
