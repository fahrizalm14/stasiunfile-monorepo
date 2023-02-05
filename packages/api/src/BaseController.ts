import { ClientError } from "@stasiunfile/error";
import { Response } from "express";

import { IController } from "./IController";

export abstract class BaseController<T> {
  public readonly data: IController[] = [];
  constructor(public readonly service: T) {
    this.register();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  register(): void {}

  protected render(res: Response, statusCode: number, data: object): Response {
    return res.status(statusCode).json(data);
  }

  protected renderError(res: Response, error: Error): Response {
    // eslint-disable-next-line no-console
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
