import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const normalizedPath = path.normalize(req.path).replace(/^(\.\.[/\\])+/, '');

            const filePath = path.join(baseDir, normalizedPath);

            // Проверяем, что итоговый путь всё еще внутри baseDir
            if (!filePath.startsWith(baseDir)) {
                console.warn(`Path traversal attempt blocked: ${req.path}`);
                return next();
            }

            fs.access(filePath, fs.constants.F_OK, (accessErr) => {
                if (accessErr) {
                    return next();
                }

                return res.sendFile(filePath, (sendErr) => {
                    if (sendErr) {
                        next(sendErr);
                    }
                });
            });
        } catch (error) {
            next();
        }
    };
}
