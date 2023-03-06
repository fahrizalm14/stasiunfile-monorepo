// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IContent, { IOutputDirectory } from '@interfaces/IContent';
import { Content } from '@utils/type';

export interface IDataUpload {
  easyUrl?: string;
  end2end?: string;
  directory?: string;
  password?: string;
  limit?: string;
  expired?: string;
  isPublic?: string;
  end2endKey?: string;
}

export interface ISaveContents {
  membershipId: string;
  contentType: string;
  size: number;
  sizeString: string;
  extension: string;
  encryptName: string;
  type: Content;
  code: string;
  easyUrl: string;
  end2end: boolean;
  options?: {
    directory?: string;
    password?: string;
    limit?: number;
    expired?: number;
    isPublic?: boolean;
  };
}

export interface IMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface IUploadValidation {
  directory: string;
  password: string;
  easyUrl: string;
  isPublic: boolean;
  limit: number;
  expired: number;
  end2end: boolean;
  end2endKey?: string;
}

export interface IUploadResponse {
  _id: string;
  name: string;
  size: number;
  contentType: string;
  type: string;
  sizeString: string;
  easyUrl: string;
  code: string;
  isPublic: boolean;
  limit: number;
  expired: number;
  end2end: boolean;
  link: string;
  updatedAt: Date;
  createdAt: Date;
  appVersion: string;
}

export interface ITrashResponse {
  _id: string;
  name: string;
  updatedAt: string;
  type: Content;
  ext: string;
}

export default interface IContentService {
  // Admin and Client
  getById(_id: string): Promise<IContent>;
  calculateStorage(membershipId: string): Promise<number>;
  // Management admin
  getAll(): Promise<IContent[]>;
  getAllFiles(): Promise<IContent[]>;
  getAllDirectories(): Promise<IContent[]>;
  deleteFile(_id: string): Promise<unknown>;
  deletePermanent(_id: string): Promise<string>;
  // Client
  getFromTrash(token: string): Promise<ITrashResponse[]>;
  getOwnDirectory(payload: {
    _id?: string;
    token?: string;
    password?: string;
  }): Promise<IOutputDirectory>;
  addDirectory(payload: {
    token: string;
    name: string;
    directory?: string;
    password?: string;
    easyUrl?: string;
    limit?: number;
    expired?: number;
    isPublic?: boolean;
  }): Promise<IUploadResponse>;
  shortLink(link: string): Promise<{
    link: string;
    name: string;
    type: string;
    size?: string;
    id: string;
    isPassword: boolean;
    isEnd2End: boolean;
  }>;
  upload(
    file: IMulterFile,
    payload: { token: string; data: IDataUpload }
  ): Promise<IUploadResponse>;
  download(payload: {
    id: string;
    token?: string;
    end2endKey?: string;
    password?: string;
  }): Promise<{
    body: Buffer;
    name: string;
    contentType: string;
  }>;
  preDownload(payload: {
    id: string;
    token?: string;
    password?: string;
  }): Promise<{
    token: string;
  }>;
  downloadStream(tokenDownload: string): Promise<{
    name: string;
    contentType: string;
    key: string;
    size: number;
  }>;
  terminate(payload: { token: string; _id: string }): Promise<IContent>;
  restore(payload: { token: string; _id: string }): Promise<IContent>;
  delete(payload: { token: string; _id: string }): Promise<IContent>;
  setPublic(payload: { token: string; _id: string }): Promise<IContent>;
  setPrivate(payload: { token: string; _id: string }): Promise<IContent>;
  rename(payload: {
    token: string;
    _id: string;
    name: string;
  }): Promise<IContent>;
  copy(payload: {
    token: string;
    _id: string;
    directoryDestination: string;
  }): Promise<IContent>;
  move(payload: {
    token: string;
    _id: string;
    directoryDestination: string;
  }): Promise<IContent>;
  share(payload: {
    token: string;
    _id: string;
    membershipId: string;
  }): Promise<string>;
  // features
  oneTimeContent(payload: {
    token: string;
    _id?: string;
    content?: IContent;
  }): Promise<string>;
  updateFeatures(payload: {
    _id: string;
    token: string;
    password?: string;
    tempPassword?: string;
    limit?: number;
    expired?: number;
  }): Promise<IContent>;
}
