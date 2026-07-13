import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpstatus from "http-status"; 
import { userController } from "./user.controller";
import { userService } from "./user.service";
import { jwtUtils } from "../../util/jwtUtils";
import { Role } from "../../../generated/prisma/client";
import { catchAsync } from "../../util/catchAsync";

import jwt from "jsonwebtoken";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.registerUser);


router.get("/me",
//     async (req: Request, res: Response, next: NextFunction) => {

//       const { accessToken } = req.cookies; 
    
//       const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
    
      
//       if(typeof verifiedToken === "string") {
//         throw new Error(verifiedToken);
//       } //for safety, if the token is a string, throw an error
      

//       const { email, name, id,role } = verifiedToken;
//     //   console.log("verifiedToken:", verifiedToken);

//       const requiredRole = [Role.ADMIN, Role.USER,Role.AUTHOR]; 

//       if (!requiredRole.includes(role)) {
//         return res.status(httpstatus.FORBIDDEN).json({
//           success: false,
//           statuscode: httpstatus.FORBIDDEN,
//           message: "You do not have permission to access this resource",
//         });
//       }

//       req.user = { 
//         email, 
//         name, 
//         id, 
//         role }; // Attach user info to the request object

//       next();

// }
auth(Role.ADMIN, Role.USER,Role.AUTHOR) , userController.getMyProfile);

router.put("/my-profile", auth(Role.ADMIN, Role.USER,Role.AUTHOR), userController.updateMyProfile);


export const userRoutes = router;
