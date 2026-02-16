import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join } from 'path'
import fs from 'fs'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

// Проверяем и создаем директорию для временных файлов
const tempDir = join(
    __dirname,
    process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public/temp'
)

// Создаем директорию, если её нет
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(null, tempDir)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        // Генерируем безопасное имя файла (НЕ используем оригинальное!)
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const ext = file.originalname.split('.').pop() || 'bin';
        const safeFileName = `upload_${timestamp}_${randomString}.${ext}`;
        cb(null, safeFileName)
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
    'image/webp',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(new Error('Неподдерживаемый тип файла. Разрешены только изображения: png, jpg, jpeg, gif, svg, webp'))
    }

    return cb(null, true)
}

// Конфигурация multer с лимитами
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1
    }
})

export default upload
