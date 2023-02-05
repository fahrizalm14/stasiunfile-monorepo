import { Request, Response } from "express";

export interface IController {
  method: "get" | "patch" | "post" | "put" | "delete";
  path: string;
  handler: (req: Request, res: Response) => Promise<Response>;
}
