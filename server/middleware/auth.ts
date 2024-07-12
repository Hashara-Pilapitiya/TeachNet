import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";
import { redis } from "../utils/redis";


// Authenticate user
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
        return next(new ErrorHandler(400, "Please login to access this resource"));
    }

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as { id: string };
    
    if (!decoded) {
        return next(new ErrorHandler(400, "Access token is invalid. Please login again"));
    }
    
    const user = await redis.get(decoded.id);

    if (!user) {
        return next(new ErrorHandler(400, "User not found. Please login again"));
    }

    req.user = JSON.parse(user);
    next();

});



// Validate user roles
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler(403, `Role: (${req.user?.role}) is not allowed to access this resource`));
        }
        next();
    }
}