// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { AwsConfig, FileConfig } from '@config';
import IContent, { ILogFile, IShared } from '@interfaces/IContent';
import { Content, FileStatus } from '@utils/type';

export default class OContent implements IContent {
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
  limit: number = FileConfig.DEFAULT_LIMIT;
  expired: number = FileConfig.DEFAULT_EXPIRED;
  status: FileStatus;
  logFile: ILogFile[] = [];
  shared: IShared[] = [];
  key?: string;
  location: string = AwsConfig.AWS_BUCKET_NAME;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  appVersion = "1.0.0";
  constructor(params: {
    _id?: string;
    membershipId: string;
    contentType: string;
    size: number;
    sizeString: string;
    extension: string;
    encryptName: string;
    type: Content;
    password: string;
    code: string;
    easyUrl: string;
    end2end: boolean;
    directory?: string;
    isPublic?: boolean;
    limit?: number;
    expired?: number;
    status?: FileStatus;
    logFile?: ILogFile[];
    shared?: IShared[];
    key?: string;
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
    appVersion?: string;
  }) {
    this._id = params._id;
    this.membershipId = params.membershipId;
    this.contentType = params.contentType;
    this.size = params.size;
    this.sizeString = params.sizeString;
    this.extension = params.extension;
    this.encryptName = params.encryptName;
    this.type = params.type;
    this.code = params.code;
    this.easyUrl = params.easyUrl;
    this.end2end = params.end2end;
    this.isPublic = params.isPublic ? true : false;
    this.status = params.status ? params.status : FileStatus.ACTIVE;
    this.logFile =
      params.logFile && params.logFile.length ? params.logFile : [];
    this.shared = params.shared && params.shared.length ? params.shared : [];
    this.directory = params.directory ? params.directory : "root";
    this.password = params.password ? params.password : "";
    this.limit = params.limit ? params.limit : this.limit;
    this.expired = params.expired ? params.expired : this.expired;
    this.createdAt = params.createdAt ? params.createdAt : this.createdAt;
    this.updatedAt = params.updatedAt ? params.updatedAt : this.updatedAt;
    this.appVersion = params.appVersion ? params.appVersion : this.appVersion;
  }
}
