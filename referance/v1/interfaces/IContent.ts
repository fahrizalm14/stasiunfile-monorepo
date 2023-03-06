// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { Content, FileStatus } from '@utils/type';

export interface ILogFile {
  membershipId: string;
  timestamp: Date;
}
export interface IShared {
  membershipId: string;
  timestamp: Date;
}
export interface IOutputFile {
  _id: string;
  owner: string;
  isOwner: boolean;
  contentType: string;
  size: number;
  sizeString: string;
  ext: string;
  name: string;
  type: Content;
  isPublic: boolean;
  isEnd2End: boolean;
  isPassword: boolean;
  directory: string;
  code: string;
  easyUrl: string;
  limit: number;
  expired: number;
  status: string;
  link: string;
  shared: IShared[];
  logFile: ILogFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOutputDirectory {
  _id: string | null;
  owner: string;
  isOwner: boolean;
  name: string;
  type: Content;
  directory: string | null;
  isPassword: boolean;
  easyUrl: string;
  code: string;
  contents?: (IOutputDirectory | IOutputFile)[];
  totalContent: {
    file: number;
    directory: number;
  };
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default interface IContent {
  _id?: string;
  membershipId: string;
  contentType: string;
  size: number;
  sizeString: string;
  extension: string;
  encryptName: string;
  type: Content;
  directory: string;
  password: string;
  code: string;
  easyUrl: string;
  end2end: boolean;
  isPublic: boolean;
  limit: number;
  expired: number;
  status: FileStatus;
  logFile: ILogFile[];
  shared: IShared[];
  key?: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  appVersion: string;
}
