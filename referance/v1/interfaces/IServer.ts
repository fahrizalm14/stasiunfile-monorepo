// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import Database from '@database';
import { Express } from 'express';


export default interface IServer {
  app: Express;
  port: number;
  mongo: Database;
}
