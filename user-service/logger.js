import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file';

const errorTransport = new transports.DailyRotateFile({
    filename: 'logs/user-service-error-%DATE%.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '2d'
});

const combinedTransport = new transports.DailyRotateFile({
    filename: 'logs/user-service-combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '2d'
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        // - Write to all logs with level `info` and below to `user-service-combined.log`.
        // - Write all logs error (and below) to `user-service-error.log`.
        errorTransport,
        combinedTransport
    ]
});

const alignedWithColorsAndTime = format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

if (process.env.NODE_ENV !== 'PROD') {
    logger.add(new transports.Console({
        format: alignedWithColorsAndTime
    }));
}

export default logger;