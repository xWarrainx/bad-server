import rateLimit from 'express-rate-limit';

// Общий лимитер для всех запросов
export const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 минута
    max: 60, // максимум 60 запросов с одного IP
    message: {
        success: false,
        message: 'Слишком много запросов с вашего IP, попробуйте позже'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Строгий лимитер для авторизации (защита от брутфорса)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 5, // максимум 5 попыток входа
    skipSuccessfulRequests: true, // не учитывать успешные запросы
    message: {
        success: false,
        message: 'Слишком много попыток входа, попробуйте позже'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Лимитер для создания заказов
export const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 час
    max: 10, // максимум 10 заказов в час
    message: {
        success: false,
        message: 'Слишком много заказов, попробуйте позже'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Лимитер для загрузки файлов
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 час
    max: 20, // максимум 20 загрузок в час
    message: {
        success: false,
        message: 'Слишком много загрузок, попробуйте позже'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
