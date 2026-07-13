import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../util/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../util/sendRensponse";


const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const { accessToken, refreshToken } = await authService.loginUser(payload);


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 24 * 60 * 60,  // 1 days
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 24 * 60 * 60,  // 1 days
    });

    sendResponse(res, {
        success: true,
        statuscode: 200,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken
        },
    });


});

export const authController = {
    loginUser
};