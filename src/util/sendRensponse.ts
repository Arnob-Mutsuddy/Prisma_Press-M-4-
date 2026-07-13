import { Response } from "express";

type Tmeta = {
  page?: number;
  limit?: number;
  total?: number;
};

type TresponseData<T> = {
  success: boolean;
  statuscode: number;
  message: string;
  data?: T;
  error?: string;
  meta?: Tmeta
};

export const sendResponse = <T>(res: Response, data: TresponseData<T>) => {
  res.status(data.statuscode).json({
    success: data.success,
    statuscode: data.statuscode,
    message: data.message,
    data: data.data,
    error: data.error,
    meta: data.meta
  });
  };