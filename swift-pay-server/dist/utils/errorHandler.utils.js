"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.notFoundHandler = void 0;
/**
 * Catches any request that didn't match a route.
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};
exports.notFoundHandler = notFoundHandler;
/**
 * Centralized error handler. Any `next(error)` call in a controller
 * (or a thrown error in an async route not caught locally) ends up here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalErrorHandler = (error, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    console.error('Unhandled error:', error);
    const status = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
    res.status(status).json(Object.assign({ success: false, message: (error === null || error === void 0 ? void 0 : error.message) || 'Something went wrong on the server' }, (process.env.NODE_ENV === 'development' && { stack: error === null || error === void 0 ? void 0 : error.stack })));
};
exports.globalErrorHandler = globalErrorHandler;
