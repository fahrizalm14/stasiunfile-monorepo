import express, { RequestHandler } from "express";

import { AppService } from "./AppService";

interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  drop(): Promise<void>;
}

export default class ApiServer {
  private readonly server = express();
  constructor(
    private readonly appService: AppService<any>[],
    private readonly middleware: RequestHandler[],
    private readonly port: number,
    private readonly database?: IDatabase,
  ) {
    this.initMiddleware();
    this.initAppService();
  }

  // inisialisasi service
  private initAppService(): void {
    this.appService.forEach((apiRoute) => {
      this.server.use(apiRoute.router);
    });

    this.server.use("*", (_req, res) => {
      try {
        return res.status(404).json({
          status: "fail",
          message: "Not found!",
        });
      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: "An error occurred trying to process your request!",
        });
      }
    });
  }

  // inisialisasi middleware
  private initMiddleware(): void {
    this.server.disable("x-powered-by");

    this.server.use(express.json());

    this.middleware.forEach((middleware) => {
      this.server.use(middleware);
    });

    // Handle nextFunction
    this.server.use((_req, _res, next) => {
      return next();
    });
  }

  // menjalankan server
  public run(): void {
    if (this.database && process.env.NODE_ENV !== "test") this.database.connect();

    this.server.listen(this.port, (): void => {
      // eslint-disable-next-line no-console
      console.log(`server on port:${this.port} now running`);
      // eslint-disable-next-line no-console
      console.log(
        `In ${process.env.NODE_ENV} mode, you can use the following command to run the server:`,
      );
    });
  }

  // menghentikan server
  public stop(): void {
    this.server
      .listen(this.port, (): void => {
        // eslint-disable-next-line no-console
        console.log(`server on port:${this.port} is stopped`);
      })
      .close();
  }
}
