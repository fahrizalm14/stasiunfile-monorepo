// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { FileConfig } from '@config';
import { InvariantError } from '@error';
import { IDataUpload, IUploadValidation } from '@interfaces/IContentService';
import { isValidObjectId } from 'mongoose';

export default class Contentvalidation {
  private readonly EXPIRED = FileConfig.DEFAULT_EXPIRED + Date.now();
  private readonly LIMIT = FileConfig.DEFAULT_LIMIT;
  public async upload(data: IDataUpload): Promise<IUploadValidation> {
    const {
      directory: reqDirectory,
      password: reqPassword,
      easyUrl: reqEasyUrl,
      limit: reqLimit,
      expired: reqExpired,
      isPublic: isPublicBool,
      end2endKey: reqEnd2EndKey
    } = data;
    let directory = 'root';
    let password = '';
    let easyUrl = '';
    let limit = this.LIMIT;
    let expired = this.EXPIRED;
    let end2end = false;
    let end2endKey: undefined | string = undefined;
    if (reqDirectory) {
      directory = reqDirectory;
      if (directory.length < 23)
        throw new InvariantError('Directory wrong length!');
    }
    if (reqPassword) {
      if (!(await this.validateSafeString(reqPassword)))
        throw new InvariantError(
          'Bad password, min length 8 and must be a combination of letters and numbers!'
        );

      password = reqPassword;
    }
    if (reqEasyUrl) {
      const containSpecial = /[!@#\$%\^&\*]/g.test(reqEasyUrl);

      if (reqEasyUrl.length < 4)
        throw new InvariantError('Easy url min length 4!');

      if (containSpecial)
        throw new InvariantError(
          'Easy url bad value, must be a combination of letters and numbers!'
        );

      easyUrl = reqEasyUrl;
    }
    if (reqEnd2EndKey && reqEnd2EndKey !== '') {
      if (reqEnd2EndKey.length < 8)
        throw new InvariantError('End to end key min length 8!');
      end2endKey = reqEnd2EndKey;
      end2end = true;
    }

    if (reqLimit && reqLimit !== '') {
      if (!parseInt(reqLimit) || parseInt(reqLimit) < 0)
        throw new InvariantError('Limit invalid payload!');
      limit = parseInt(reqLimit);
    }
    if (reqExpired && reqExpired !== '') {
      if (!parseInt(reqExpired) || parseInt(reqExpired) < Date.now())
        throw new InvariantError('Expired invalid payload!');
      expired = parseInt(reqExpired);
    }
    if (isPublicBool && !['false', 'true'].includes(isPublicBool))
      throw new InvariantError('Is public invalid payload!');
    const isPublic = isPublicBool === 'true' ? true : false;

    return {
      directory,
      password,
      easyUrl,
      isPublic,
      limit,
      expired,
      end2end,
      end2endKey
    };
  }

  public async addDirectory(payload: {
    directory?: string;
    password?: string;
    easyUrl?: string;
    limit?: number;
    expired?: number;
    isPublic?: boolean;
  }): Promise<{
    directory: string;
    password: string;
    easyUrl: string;
    limit: number;
    expired: number;
    isPublic: boolean;
  }> {
    const {
      directory: reqDirectory,
      password: reqPassword,
      easyUrl: reqEasyUrl,
      limit: reqLimit,
      expired: reqExpired,
      isPublic: isPublicBool
    } = payload;
    let directory = 'root';
    let password = '';
    let easyUrl = '';
    let limit = this.LIMIT;
    let expired = this.EXPIRED;
    if (typeof reqDirectory !== 'string')
      throw new InvariantError('Directory invalid value!');
    if (reqDirectory) {
      directory = reqDirectory;
      if (directory.length < 23)
        throw new InvariantError('Directory wrong length!');
    }
    if (typeof reqPassword !== 'string')
      throw new InvariantError('Password invalid value!');
    if (reqPassword) {
      if (!(await this.validateSafeString(reqPassword)))
        throw new InvariantError(
          'Bad password, min length 8 and must be a combination of letters and numbers!'
        );

      password = reqPassword;
    }
    if (typeof reqEasyUrl !== 'string')
      throw new InvariantError('Easy url invalid value!');
    if (reqEasyUrl) {
      const containSpecial = /[!@#\$%\^&\*]/g.test(reqEasyUrl);

      if (reqEasyUrl.length < 4)
        throw new InvariantError('Easy url min length 4!');

      if (containSpecial)
        throw new InvariantError(
          'Easy url bad value, must be a combination of letters and numbers!'
        );

      easyUrl = reqEasyUrl;
    }

    if (reqLimit) {
      if (typeof reqLimit !== 'number' || reqLimit < 0)
        throw new InvariantError('Limit invalid payload!');
      limit = reqLimit;
    }
    if (reqExpired) {
      if (typeof reqExpired !== 'number' || reqExpired < Date.now())
        throw new InvariantError('Expired invalid payload!');
      expired = reqExpired;
    }

    if (typeof isPublicBool !== 'boolean')
      throw new InvariantError('Is public invalid value!');
    const isPublic = isPublicBool ? true : false;
    return {
      directory,
      password,
      easyUrl,
      isPublic,
      limit,
      expired
    };
  }

  public async download(payload: {
    id: string;
    token?: string;
    end2endKey?: string;
    password?: string;
  }): Promise<void> {
    const { id, end2endKey, password } = payload;
    if (id && id !== '') {
      if (typeof id !== 'string' || id.length < 32)
        throw new InvariantError('Id content invalid value!');
    }
    if (end2endKey && end2endKey !== '') {
      if (typeof end2endKey !== 'string')
        throw new InvariantError('End to end key content invalid value!');
    }
    if (password && password !== '') {
      if (typeof password !== 'string')
        throw new InvariantError('Password invalid value!');
    }
  }

  public async isMongoId(_id: string): Promise<void> {
    if (!isValidObjectId(_id)) throw new InvariantError('Id invalid value!');
  }

  public async crud(payload: { token: string; _id: string }): Promise<void> {
    const { _id } = payload;
    await this.isMongoId(_id);
  }

  public async getOwnDirectory(payload: {
    _id?: string;
    token?: string;
    password?: string;
  }): Promise<void> {
    const { _id, password } = payload;
    if (_id && _id !== '') {
      await this.isMongoId(_id);
    }
    if (password && password !== '') {
      if (typeof password !== 'string')
        throw new InvariantError('Password invalid value!');
    }
  }

  public async shortLink(link: string): Promise<void> {
    if (link && link !== '') {
      if (typeof link !== 'string')
        throw new InvariantError('Shorlink invalid value!');
    }
  }

  public async calculateStorage(membershipId: string): Promise<void> {
    if (
      !membershipId ||
      membershipId === '' ||
      typeof membershipId !== 'string'
    )
      throw new InvariantError('Membership id invalid value!');
  }

  public async rename(payload: {
    token: string;
    _id: string;
    name: string;
  }): Promise<void> {
    const { _id, name } = payload;
    await this.isMongoId(_id);

    if (!name || name === '' || typeof name !== 'string')
      throw new InvariantError('Name invalid value!');
  }

  public async copy(payload: {
    token: string;
    _id: string;
    directoryDestination: string;
  }): Promise<void> {
    const { _id, directoryDestination } = payload;
    await this.isMongoId(_id);

    if (
      !directoryDestination ||
      directoryDestination === '' ||
      typeof directoryDestination !== 'string'
    )
      throw new InvariantError('Directory destination invalid value!');
  }

  public async move(payload: {
    token: string;
    _id: string;
    directoryDestination: string;
  }): Promise<void> {
    const { _id, directoryDestination } = payload;
    if (directoryDestination !== 'root') {
      await this.isMongoId(_id);

      if (
        !directoryDestination ||
        directoryDestination === '' ||
        typeof directoryDestination !== 'string'
      )
        throw new InvariantError('Directory destination invalid value!');
    }
  }

  public async updateFeatures(payload: {
    _id: string;
    token: string;
    password?: string;
    tempPassword?: string;
    limit?: number;
    expired?: number;
  }): Promise<void> {
    const { _id, expired, limit, password, tempPassword } = payload;
    await this.isMongoId(_id);

    if (typeof password !== 'string' || (tempPassword && password === '')) {
      throw new InvariantError('Password invalid value!');
    }
    if (password && !(await this.validateSafeString(password)))
      throw new InvariantError(
        'Bad password, min length 8 and must be a combination of letters and numbers!'
      );
    // TODO
    // if (typeof tempPassword !== "string" || (password && tempPassword === "")) {
    //   throw new InvariantError("Old password invalid value!");
    // }
    if (!limit || limit <= 0)
      throw new InvariantError('Limit invalid payload!');
    if (!expired || expired < Date.now())
      throw new InvariantError('Expired invalid payload!');
  }

  public async limitCheckPublic(size: number): Promise<void> {
    // TODO belum ada interface
    if (size > FileConfig.FREE_LIMIT_SIZE)
      throw new InvariantError(
        'You should registering to access full service!'
      );
  }

  public async limitCheckE2E(size: number): Promise<void> {
    // TODO belum ada interface
    if (size > FileConfig.E2E_LIMIT_SIZE)
      throw new InvariantError('Sorry E2E file upload max limit!');
  }

  private async validateSafeString(password: string): Promise<boolean> {
    const validaLength = password.length >= 8;
    const containNumber = /[0-9]/g.test(password);
    const containLetter = /[a-zA-Z]/g.test(password);
    const containSpecial = /[!@#\$%\^&\*]/g.test(password);

    return validaLength && containNumber && containLetter && !containSpecial;
  }

  public async share(payload: {
    token: string;
    _id: string;
    membershipId: string;
  }): Promise<void> {
    const { membershipId, _id } = payload;
    if (!isValidObjectId(_id) || typeof _id !== 'string')
      throw new InvariantError('Id invalid value!');
    if (!isValidObjectId(membershipId) || typeof membershipId !== 'string')
      throw new InvariantError('Membership id invalid value!');
  }
}
