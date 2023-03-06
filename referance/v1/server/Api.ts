// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import RootHandler from '@api/root/handler';
import IApi, { IApiServer } from '@interfaces/IApi';
import { httpRequestLogger } from '@plugins/log';
import cors from 'cors';
import express, {
  ErrorRequestHandler,
  Express,
  Handler,
  NextFunction,
  Request,
  Response
} from 'express';
import helmet from 'helmet';

export default class Api implements IApiServer {
  public app: Express = express();
  private readonly api: IApi[];
  private readonly _root: RootHandler = new RootHandler();

  constructor(...api: IApi[]) {
    this.api = api;
    this.middelwares();
    this.routes();
  }

  private middelwares(): void {
    this.app.use(cors());
    this.app.disable('x-powered-by');
    this.app.use(express.json());
    this.app.use(helmet());
    if (httpRequestLogger) this.app.use(this.unless(httpRequestLogger));
    // Handle nextFunction
    this.app.use((_req, _res, next) => {
      return next();
    });
  }

  private unless(middleware: Handler) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.path === '/') {
        return next();
      } else {
        return middleware(req, res, next);
      }
    };
  }

  private routes(): void {
    this.app.use(
      (
        err: ErrorRequestHandler,
        _req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (err instanceof SyntaxError) {
          return res.status(400).json({
            status: 'error',
            message: 'An error occurred, the payload is very bad!'
          }); // Bad request
        }
        next();
      }
    );
    this.api.forEach((r) => {
      console.log(`Endpoint: ${r.endpoint} installed!`);
      this.app.use(r.endpoint, r.router);
    });
    this.app.get('/', this._root.getHandler);
    this.app.use('*', this._root.notFoundHandler);
  }
}
