import { NextFunction, Request, RequestHandler, Response } from "express";
import httpstatus from "http-status";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error("Error in async function:", error);
      res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statuscode: httpstatus.INTERNAL_SERVER_ERROR,
        message: "Error processing request",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
