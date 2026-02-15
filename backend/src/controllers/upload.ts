import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import fs from 'fs/promises'
import BadRequestError from '../errors/bad-request-error'
import { fileTypeFromFile } from 'file-type'

const minFileSize = 2 * 1024; // 2KB
const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp'];

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'));
    }

    try {
        // Проверка минимального размера
        if (req.file.size < minFileSize) {
            await fs.unlink(req.file.path).catch(() => {});
            return next(new BadRequestError(`Файл слишком маленький. Минимальный размер: ${minFileSize / 1024}KB`));
        }

        // Проверка метаданных файла
        const fileType = await fileTypeFromFile(req.file.path);

        if (!fileType) {
            await fs.unlink(req.file.path).catch(() => {});
            return next(new BadRequestError('Не удалось определить тип файла'));
        }

        // Проверка MIME типа
        if (!allowedMimeTypes.includes(fileType.mime)) {
            await fs.unlink(req.file.path).catch(() => {});
            return next(new BadRequestError(`Неподдерживаемый тип файла: ${fileType.mime}`));
        }

        // Проверка, что это действительно изображение
        if (!fileType.mime.startsWith('image/')) {
            await fs.unlink(req.file.path).catch(() => {});
            return next(new BadRequestError('Файл должен быть изображением'));
        }

        // Формируем путь для сохранения
        const uploadPath = process.env.UPLOAD_PATH || 'images';
        const fileName = req.file.filename;

        // Возвращаем информацию (не возвращаем оригинальное имя)
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName: `/${uploadPath}/${fileName}`,
            fileSize: req.file.size,
            fileType: fileType.mime,
            uploadedAt: new Date().toISOString()
        });
    } catch (error) {
        // В случае ошибки удаляем файл
        if (req.file?.path) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        return next(error);
    }
}

export default {};
