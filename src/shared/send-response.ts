import { Response } from "express";
import { IResponseData } from "../interfaces/util-type";

export const sendResponse = <T>(
  res: Response,
  responseData: IResponseData<T>,
) => {
  const { httpStatusCode, success, message, data, meta } = responseData;

  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta,
  });
};
