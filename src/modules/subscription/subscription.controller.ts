import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { subscriptionServices } from "./subscription.service";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendRensponse";

const createCheckoutSession = catchAsync(
    async (req : Request, res : Response, next : NextFunction) => {
        const userId = req.user?.id;

        const result = await subscriptionServices.createCheckoutSession(userId as string);

        sendResponse(res, {
            success : true,
            statuscode : httpStatus.OK,
            message : "Checkout completed successfully",
            data : result
        })
    }
);

const handleWebhook = catchAsync(
    async( req : Request, res : Response, next : NextFunction) => {
        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature']!;

        await subscriptionServices.handleWebhook(event, signature as string)

        sendResponse(res, {
            success : true,
            statuscode : 200,
            message : "Webhook triggered successfully",
            data : null
        })
    }
)

const getSubscriptionStatus = catchAsync(
    async (req : Request, res : Response, next : NextFunction) => {
        const userId = req.user?.id

        const result = await subscriptionServices.getSubscriptionStatus(userId as string);

        sendResponse(res, {
            success : true,
            statuscode : httpStatus.OK,
            message : "Subscription status retrived successfully",
            data : result
        })
    }
)


export const subscriptionController = {
    createCheckoutSession,
    handleWebhook,
    getSubscriptionStatus
}