import { BaseController } from "@stasiunfile/api";

import { InternalService } from "./service";

export class Controller extends BaseController<InternalService> {
  constructor(service?: InternalService) {
    super(service || new InternalService());
  }

  register(): void {
    this.add({
      handler: this.getTrueHandler,
      method: "get",
      path: "",
    });
  }

  // eslint-disable-next-line require-await
  private async getTrueHandler(_req: any, res: any) {
    try {
      return super.render(res, 200, {
        status: "success",
        message: "StasiunFile ",
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }
}
