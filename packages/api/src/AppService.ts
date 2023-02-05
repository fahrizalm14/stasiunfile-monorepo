import { Router } from "express";

import { BaseController } from "./BaseController";

export class AppService<T> {
  public readonly router: Router = Router();
  constructor(
    private readonly name: string,
    private readonly version: number,
    private readonly controller: BaseController<T>,
  ) {
    this.initial();
  }

  private initial(): void {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.controller.data.forEach(({ handler, method, path }) => {
      this.router[method](`/${this.name}/v${this.version}/${path}`, handler);
    });
  }
}
