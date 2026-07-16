"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
/**
 * Restricts a route to specific roles. Must run AFTER `authenticate`,
 * since it relies on `req.user` being populated from the JWT.
 *
 * Usage: router.get('/admin-only', authenticate, authorize('admin'), handler)
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        var _a;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (!role) {
            res.status(401).json({ success: false, message: 'Unauthorized: No role found on token' });
            return;
        }
        if (!allowedRoles.includes(role)) {
            res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
