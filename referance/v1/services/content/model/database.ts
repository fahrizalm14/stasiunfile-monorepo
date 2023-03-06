// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IContent, { ILogFile, IShared } from '@interfaces/IContent';
import { Model, model, Schema } from 'mongoose';

export const logFileSchema: Schema<ILogFile> = new Schema({
  membershipId: String,
  timestamp: Date
});

export const sharedSchema: Schema<IShared> = new Schema({
  membershipId: String,
  timestamp: Date
});
const contentSchema: Schema<IContent> = new Schema({
  membershipId: String,
  contentType: String,
  size: Number,
  sizeString: String,
  extension: String,
  encryptName: String,
  type: String,
  directory: String,
  password: String,
  code: String,
  easyUrl: String,
  end2end: Boolean,
  isPublic: Boolean,
  limit: Number,
  expired: Number,
  status: String,
  logFile: [logFileSchema],
  shared: [sharedSchema],
  location: String,
  key: String,
  createdAt: Date,
  updatedAt: Date,
  appVersion: String
});

export const contentsDatabase: Model<IContent> = model(
  'contents',
  contentSchema
);
