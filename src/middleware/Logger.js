const fs = require('fs');
const path = require('path');

// Specify the path for the log file
const logFilePath = path.join(__dirname, 'logs', 'app.log');

// Create a write stream to the log file
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

function loggerMiddleware(req, res, next) {
    const start = new Date();

    // Log the request method, URL, and timestamp to the console
    console.log(`[${start.toISOString()}] ${req.method} ${req.url}`);

    // Log the same information to the log file
    logStream.write(`[${start.toISOString()}] ${req.method} ${req.url}\n`);

    // Capture the response finish event to log the response details
    res.on('finish', () => {
        const end = new Date();
        const duration = end - start;

        // Log the response status, duration, and additional details to the console
        console.log(`[${end.toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);

        // Log the same information to the log file
        logStream.write(`[${end.toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms\n`);
    });

    // Capture the response error event to log the error details to the console
    res.on('error', (err) => {
        console.error('Error:', err);

        // Log the same error information to the log file
        logStream.write(`Error: ${err}\n`);
    });

    // Call the next middleware in the chain
    next();
}

module.exports = loggerMiddleware;
