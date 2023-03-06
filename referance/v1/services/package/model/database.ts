// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IPackage from '@interfaces/IPackage';
import { Model, model, Schema } from 'mongoose';

const packageSchema: Schema<IPackage> = new Schema({
  name: String,
  price: Number,
  storage: Number,
  expired: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date,
});

export const packagesDatabase: Model<IPackage> = model(
  "packages",
  packageSchema
);
