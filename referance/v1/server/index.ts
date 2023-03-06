// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IApi, { IApiServer } from '@interfaces/IApi';
import IDatabes from '@interfaces/IDatabes';
import Api from './Api';
export default class Server {
  private readonly port: number;
  public readonly api: IApiServer;
  private readonly database?: IDatabes;
  constructor(options: { port: number; database?: IDatabes }, ...api: IApi[]) {
    this.api = new Api(...api);
    this.port = options.port;
    this.database = options.database;
  }

  public run(): void {
    if (this.database && process.env.NODE_ENV !== 'test')
      this.database.connect();

    this.api.app.listen(this.port, (): void => {
      console.log(`server run on http://localhost:${this.port}`);
      console.log(
        `In ${process.env.NODE_ENV} mode, you can use the following command to run the server:`
      );
    });
  }
}
