import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

import httpstatus from "http-status"; 
import config from "../../config";
import { userService } from "./user.service";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendRensponse";
import { jwtUtils } from "../../util/jwtUtils";

// const registerUser = async (req: Request, res: Response) => {  
//     try {
//       const payload = req.body;

//       const user = await userService.registerUserIntoDB(payload);

//       res.status(httpstatus.CREATED).json({
//         success: true,
//         statuscode: httpstatus.CREATED,
//         message: "User registered successfully",
//         data: {
//           user, 
//         },
//       });
//     } catch (error) {
//       console.error("Error registering user:", error);
//       res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         statuscode: httpstatus.INTERNAL_SERVER_ERROR,
//         message: "Error registering user",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
// }


const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await userService.registerUserIntoDB(payload);

  // res.status(httpstatus.CREATED).json({
  //   success: true,
  //   statuscode: httpstatus.CREATED,
  //   message: "User registered successfully",
  //   data: {
  //     user,
  //   },
  // });

  sendResponse(res, {
    success: true,
    statuscode: httpstatus.CREATED,
    message: "User registered successfully",
    data: {
      user,
    },
  });

});

//verify token and get user profile


const getMyProfile = catchAsync(async (req: Request, res: Response,next: NextFunction) => { 
  // const { accessToken } = req.cookies; //from cookie

  // const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);

  // // console.log("verifiedToken:", verifiedToken);

  // if(typeof verifiedToken === "string") {
  //   throw new Error(verifiedToken);
  // } //for safety, if the token is a string, throw an error

  // const profile = await userService.getMyProfile(verifiedToken.id);
  
  const profile = await userService.getMyProfile(req.user?.id as string); //form route middleware, we have attached user info to the request object, so we can access it here

  sendResponse(res, {
    success: true,
    statuscode: httpstatus.OK,
    message: "User profile fetched successfully",
    data: {
      profile,
    },
  });

 });


 const updateMyProfile = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
  const userId = req.user?.id as string; 
  
  const payload = req.body;

  const updatedProfile = await userService.updateMyProfile(userId, payload);

  sendResponse(res, {
    success: true,
    statuscode: httpstatus.OK,
    message: "User profile updated successfully",
    data: {
      updatedProfile,
    },
  });

 });

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile
};