const winston = require("winston");

// Create winston for app
const appLogger = new winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.label({ label: "APP" }),
                winston.format.timestamp(),
                winston.format.printf(({ message, label }) => `[${label}] ${message}`)
            ),
        }),
    ],
});

const apiLogger = new winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.label({ label: "API" }),
                winston.format.timestamp(),
                winston.format.printf(({ message, label, type }) => `[${label}-${type}] ${message}`)
            ),
        }),
    ],
});

const serverLogger = new winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.label({ label: "SERVER" }),
                winston.format.timestamp(),
                winston.format.printf(({ message, label }) => `[${label}] ${message}`)
            ),
        }),
    ],
});

module.exports = {
    appLogger,
    apiLogger,
    serverLogger,
};
