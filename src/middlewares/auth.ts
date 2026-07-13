import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../util/catchAsync";
import config from "../config";
import { jwtUtils } from "../util/jwtUtils";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            };
        }
    }
}

export const auth = (...requiredRole: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken 
        || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] 
        : req.headers.authorization);

        if (!token) {
            throw new Error("You are not authorized to access this resource");
        }
        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        // if (typeof verifiedToken === "string") {
        //     throw new Error(verifiedToken);
        // }
        if(!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }

        const { email, name, id,role } = verifiedToken.data as jwt.JwtPayload;

         if (requiredRole.length && !requiredRole.includes(role)) {
        return new Error("You do not have permission to access this resource");
      }

      const user = await prisma.user.findUnique({
        where: { 
            id,
            email,
            name,
            role
         }
        });

        if (!user) {
            throw new Error("User not found, please login again");
        }
        if (user.activeStatus === "BLOCKED") {
            throw new Error("Your account is blocked, please contact support");
        }

      req.user = { 
        email, 
        name, 
        id, 
        role };

        

        next();

    })
}