import ApiServer, { AppService, BaseController } from "@stasiunfile/api";

class ExampleService {
  // eslint-disable-next-line require-await
  async getNumber() {
    return 0;
  }
}

class ExampleController extends BaseController<ExampleService> {
  constructor() {
    super(new ExampleService());
    // this.get = this.get.bind(this);
  }

  private get() {
    // eslint-disable-next-line require-await
    const handler = async (_req: any, res: any) => {
      return this.render(res, 200, { data: await this.service.getNumber() });
    };

    this.add({
      handler,
      method: "get",
      path: "",
    });
    // console.log(handler);
    // this.data.push({
    //   handler,
    //   method: "get",
    //   path: "",
    // });
  }

  register(): void {
    this.get();
  }
}

const example = new AppService("example", 1, new ExampleController());

const apiServer = new ApiServer([example], [], 2000);

apiServer.run();
