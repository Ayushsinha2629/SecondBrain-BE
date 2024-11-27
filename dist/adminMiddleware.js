"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
    //@ts-ignore
    const role = req.role;
    if (role !== "admin") {
        res.status(403).json({
            message: "Access denied. Admins only.",
        });
    }
    else {
        next();
    }
};
exports.adminMiddleware = adminMiddleware;
