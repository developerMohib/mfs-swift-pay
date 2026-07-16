"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = require("./routes/authRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const agentRoutes_1 = require("./routes/agentRoutes");
const transactionRoutes_1 = require("./routes/transactionRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
// parsers
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// https://swift-pay-client-theta.vercel.app
// http://localhost:5173
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'https://swift-pay-client-theta.vercel.app',
        'http://localhost:8000',
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// routes
app.use('/auth', authRoutes_1.authRouter);
app.use('/admin', adminRoutes_1.adminRouter);
app.use('/agent', agentRoutes_1.agentRouter);
app.use('/all', userRoutes_1.userRouter);
app.use('/user', userRoutes_1.userRouter); // user/details
app.use('/all', agentRoutes_1.agentRouter);
app.use('/agent', agentRoutes_1.agentRouter);
app.use('/approved', agentRoutes_1.agentRouter);
app.use('/rejected', agentRoutes_1.agentRouter);
app.use('/all', transactionRoutes_1.transectionRouter);
app.use('/user', transactionRoutes_1.transectionRouter); // user/cash-out
// server static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/', 'index.html'));
});
// Home route
app.get('/health', (req, res) => {
    res.status(200).send('swiftPay server is ready');
});
app.get('/api/test-cookie', (req, res) => {
    res.json({ cookies: req.cookies });
});
// global route error handler
app.all('*', (req, res) => {
    res.status(400).json({
        success: false,
        message: 'Route not found',
    });
});
app.use((error, req, res, next) => {
    if (error) {
        res.status(400).json({
            success: false,
            message: 'Server something went wrong',
        });
    }
    next();
});
exports.default = app;
