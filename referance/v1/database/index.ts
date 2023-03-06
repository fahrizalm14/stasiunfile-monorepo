// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IDatbase from '@interfaces/IDatabes';
import mongoose, { ConnectOptions } from 'mongoose';


export default class Database implements IDatbase {
  mongoUri: string;
  constructor(mongoUri: string) {
    this.mongoUri = mongoUri;
  }
  async connect(): Promise<void> {
    try {
      const options: ConnectOptions = {
        autoIndex: true,
        autoCreate: true,
      };
      mongoose.connect(this.mongoUri, options);
      console.log("Mongoose connected...");
    } catch (err) {
      throw new Error("Connecting database failed!");
    }
  }

  async disconnect(): Promise<void> {
    const disconnecting = await mongoose.connection.close();
    console.log("Database disconnected...");
    return disconnecting;
  }

  async drop(): Promise<void> {
    return await mongoose.connection.dropDatabase();
  }
}
