import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { Role } from '../models/user'
import { uploadLimiter } from '../middlewares/rateLimiter'

const uploadRouter = Router()

// Только админы могут загружать файлы
uploadRouter.post(
    '/',
    auth,
    roleGuardMiddleware(Role.Admin),
    uploadLimiter,
    fileMiddleware.single('file'),
    uploadFile
)

export default uploadRouter
