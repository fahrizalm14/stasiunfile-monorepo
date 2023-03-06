// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import ClientError from '@error/ClientError';
import { Response } from 'express';


export default class BaseHandler {
  protected render(res: Response, statusCode: number, data: object): Response {
    return res.status(statusCode).json(data);
  }

  protected renderError(res: Response, error: Error) {
    if (error) console.log(error.message);
    if (error instanceof ClientError) {
      return res.status(error.statusCode).json({
        status: "fail",
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "An error occurred trying to process your request!",
    });
  }
}
