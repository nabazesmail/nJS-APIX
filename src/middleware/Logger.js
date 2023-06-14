// loggerMiddleware.js

function loggerMiddleware(req, res, next) {
    const start = new Date();

    // Log the request method, URL, and timestamp
    console.log(`[${start.toISOString()}] ${req.method} ${req.url}`);

    // Capture the response finish event to log the response details
    res.on('finish', () => {
        const end = new Date();
        const duration = end - start;

        // Log the response status, duration, and additional details
        console.log(`[${end.toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });

    // Capture the response error event to log the error details
    res.on('error', (err) => {
        console.error('Error:', err);
    });

    // Call the next middleware in the chain
    next();
}

module.exports = loggerMiddleware;