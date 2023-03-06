/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { AwsConfig, FileConfig } from '@config';
import { AuthorizationError, InvariantError, NotFoundError } from '@error';
import IContent, { IOutputDirectory, IOutputFile } from '@interfaces/IContent';
import IContentService, {
  IDataUpload,
  IMulterFile,
  ITrashResponse,
  IUploadResponse
} from '@interfaces/IContentService';
import IMembership from '@interfaces/IMembership';
import IStorageEngine from '@interfaces/IStorageEngine';
import AWSS3 from '@plugins/AWSS3';
import Protocol from '@plugins/Protocol';
import MembershipService from '@services/membership';
import MembershipModel from '@services/membership/model';
import { Content, FileStatus, MemberStatus } from '@utils/type';
import bytes from 'bytes';
import ContentModel from './model';
import ContentValidation from './validation';

export default class ContentService implements IContentService {
  private readonly PUBLIC_MEMBERSHIP: IMembership = {
    _id: 'public',
    storage: 0,
    expired: 0,
    phoneNumber: '',
    nonce: '',
    publicAddress: 'public'
  };
  private readonly APP_VERSION = '1.0.0';
  private validator: ContentValidation = new ContentValidation(); // Validator AuthService instance

  constructor(
    private readonly membershipService: MembershipService = new MembershipService(
      new MembershipModel()
    ),
    private readonly model: ContentModel = new ContentModel(),
    public readonly storageEngine: IStorageEngine = new AWSS3(),
    private readonly protocol: Protocol = new Protocol(membershipService)
  ) {}
  public async getFromTrash(token: string): Promise<ITrashResponse[]> {
    if (typeof token !== 'string')
      throw new InvariantError('token is not string');
    if (token.length > 600) throw new InvariantError('token is too long');
    const member: IMembership = await this.protocol.ACS101(token);
    const contents = await this.model.find({
      membershipId: member._id!,
      status: FileStatus.TRASH
    });
    const result: ITrashResponse[] = [];
    await Promise.all(
      contents.map(async (content: IContent) => {
        const { _id, encryptName, updatedAt, type, extension } = content;
        if (content.directory === 'root') {
          // Show all content if directory is root
          result.push({
            _id: _id!,
            name: this.protocol.end2end.decryptFileName(encryptName),
            updatedAt: updatedAt.toISOString(),
            type,
            ext: extension
          });
        } else {
          const directory = await this.getById(content.directory);
          // show only content if directory  is no trash
          if (
            directory &&
            directory.membershipId === member._id &&
            directory.status !== FileStatus.TRASH
          ) {
            result.push({
              _id: _id!,
              name: this.protocol.end2end.decryptFileName(encryptName),
              updatedAt: updatedAt.toISOString(),
              type,
              ext: extension
            });
          }
        }
      })
    );
    return result;
  }
  public async setPublic(payload: {
    token: string;
    _id: string;
  }): Promise<IContent> {
    await this.validator.crud(payload);
    const { token, _id } = payload;
    const member: IMembership = await this.protocol.ACS101(token);
    await this.protocol.OWN101(await this.getById(_id), member._id!);

    const query = await this.model.updateById(_id, {
      isPublic: true
    });

    await this.model.update({ directory: _id }, { isPublic: true });

    if (!query) throw new InvariantError('Content not found!');

    if (query.isPublic !== true) {
      throw new InvariantError('Failed set content to private!');
    }

    return query;
  }
  public async setPrivate(payload: {
    token: string;
    _id: string;
  }): Promise<IContent> {
    await this.validator.crud(payload);
    const { token, _id } = payload;
    const member: IMembership = await this.protocol.ACS101(token);
    await this.protocol.OWN101(await this.getById(_id), member._id!);

    const query = await this.model.updateById(_id, {
      isPublic: false
    });

    await this.model.update({ directory: _id }, { isPublic: false });

    if (!query) throw new InvariantError('Content not found!');

    if (query.isPublic !== false) {
      throw new InvariantError('Failed set content to private!');
    }

    return query;
  }
  public async preDownload(payload: {
    id: string;
    token?: string | undefined;
    password?: string | undefined;
  }): Promise<{ token: string }> {
    const { id, password, token } = payload;
    await this.validator.isMongoId(id);
    const content: IContent = await this.protocol.SCO01(await this.getById(id));
    if (!(await this.protocol.isFile(content.type)))
      throw new InvariantError('File not found!');
    let member: IMembership;
    if (token) {
      member = await this.protocol.ACS101(token);
    } else {
      member = this.PUBLIC_MEMBERSHIP;
    }
    const isPublic = await this.protocol.isPublic(content.isPublic);
    const isOwner = member._id === content.membershipId;
    const isMemberShared = await this.isMemberShared(member._id!, content);
    if (content.end2end) {
      throw new InvariantError('isEnd2End');
    } else {
      if (!isOwner || content.membershipId === 'public') {
        if (!isMemberShared && !isPublic && content.membershipId !== 'public')
          throw new AuthorizationError('Content is private!');
        await this.protocol.isCorrectPassword(content.password, password!);
        await this.protocol.isContentActive(content.status);
        await this.protocol.isContentExpired(content.expired);
        await this.protocol.isContentLimit(
          content.logFile.length,
          content.limit
        );
      }
    }

    const tokenDownload = await this.protocol.generateTokenDownload(
      this.protocol.end2end.encryptFileName(content._id!.toString()),
      member._id!
    );

    return { token: tokenDownload };
  }

  public async uploadStream(
    token: string | undefined,
    size: number,
    key: string,
    directory: string,
    contentType: string,
    name: string
  ) {
    let membershipId: string;
    if (token) {
      const member = await this.protocol.ACS101(token);
      const totalStorage = await this.calculateStorage(member._id!);

      if (member.storage <= totalStorage + size)
        throw new InvariantError('Storage is full!');
      membershipId = member._id!;
    } else {
      await this.validator.limitCheckPublic(size);
      membershipId = 'public';
    }
    if (directory !== 'root') {
      this.validator.isMongoId(directory);
      const _dir = await this.model.getById(directory);
      if (!_dir) throw new InvariantError('Directory not found!');
      if (_dir.membershipId !== membershipId)
        throw new InvariantError("You're not owner this directory!");
    }
    const code = await this.createCode();
    await this.model
      .save({
        membershipId,
        directory,
        password: '',
        type: Content.FILE,
        contentType,
        sizeString: bytes(size),
        size: size,
        easyUrl: code,
        code,
        encryptName: key,
        limit: FileConfig.DEFAULT_LIMIT,
        expired: FileConfig.DEFAULT_EXPIRED,
        isPublic: false,
        key,
        extension: this.getExtension(name),
        appVersion: this.APP_VERSION,
        end2end: false,
        logFile: [],
        shared: [],
        location: AwsConfig.AWS_BUCKET_NAME,
        status: FileStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .catch((e) => {
        console.log(`Model error:${e} `);
        throw new InvariantError('Upload failed!');
      });
    return code;
  }
  // Built in validation
  public async upload(
    file: IMulterFile,
    payload: { token?: string; data: IDataUpload }
  ): Promise<IUploadResponse> {
    if (!file) throw new InvariantError('File required!');
    const { token, data } = payload;
    const {
      directory,
      password,
      easyUrl: payloadEasyUrl,
      isPublic,
      limit,
      expired,
      end2end,
      end2endKey
    } = await this.validator.upload(data);
    let membershipId: string;
    if (token) {
      const member = await this.protocol.ACS101(token);
      const totalStorage = await this.calculateStorage(member._id!);

      if (member.storage <= totalStorage + file.size)
        throw new InvariantError('Storage is full!');
      membershipId = member._id!;
    } else {
      await this.validator.limitCheckPublic(file.size);
      membershipId = 'public';
    }
    if (
      (await this.checkCodeAndEasyUrl(payloadEasyUrl)) &&
      payloadEasyUrl !== ''
    )
      throw new InvariantError('Easy url already exist!');
    if (directory !== 'root') {
      const _dir = await this.model.getById(directory);
      if (!_dir) throw new InvariantError('Directory not found!');
      if (_dir.membershipId !== membershipId)
        throw new InvariantError("You're not owner this directory!");
    }
    if (end2end) await this.validator.limitCheckE2E(file.size);
    const { Key } = await this.storageEngine
      .upload(file.path, file.originalname, end2endKey)
      .catch((e) => {
        console.log(`Storage engine error: ${e.message}`);
        throw new InvariantError('Upload failed!');
      });
    const code = await this.createCode();
    const easyUrl =
      payloadEasyUrl === '' ? code : payloadEasyUrl.replace(/ /g, '');

    const content = await this.model
      .save({
        membershipId,
        directory,
        password:
          password && password !== ''
            ? await this.protocol.end2end.sha256(password)
            : '',
        type: Content.FILE,
        contentType: file.mimetype,
        sizeString: bytes(file.size),
        size: file.size,
        easyUrl,
        code,
        encryptName: Key,
        limit,
        expired,
        isPublic,
        key: Key,
        extension: this.getExtension(file.originalname),
        appVersion: this.APP_VERSION,
        end2end,
        logFile: [],
        shared: [],
        location: AwsConfig.AWS_BUCKET_NAME,
        status: FileStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .catch((e) => {
        console.log(`Model error:${e} `);
        throw new InvariantError('Upload failed!');
      });

    return {
      _id: content._id!,
      name: file.originalname,
      size: content.size,
      contentType: content.contentType,
      type: content.type,
      sizeString: content.sizeString,
      easyUrl: content.easyUrl,
      code: content.code,
      isPublic: content.isPublic,
      limit: content.limit,
      expired: content.expired,
      end2end: content.end2end,
      link: `${this.protocol.end2end.encryptFileName(content._id!.toString())}`,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      appVersion: content.appVersion
    };
  }

  // TODO: Download without encryption
  public async downloadStream(tokenDownload: string): Promise<{
    name: string;
    contentType: string;
    key: string;
    size: number;
  }> {
    if (typeof tokenDownload !== 'string' || tokenDownload.length > 500)
      throw new InvariantError('Id must be string!');
    const { id, membershipId } = await this.protocol.decodeTokenDownload(
      tokenDownload
    );
    const _id = this.protocol.end2end.decryptFileName(id); //Decrypt ID content
    await this.validator.isMongoId(_id);
    const content: IContent = await this.getById(_id);

    if (content.membershipId !== membershipId)
      await this.model.addLogFile(_id, membershipId);
    return {
      name: this.protocol.end2end.decryptFileName(content.encryptName),
      contentType: content.contentType,
      key: content.key!,
      size: content.size
    };
  }

  public async download(payload: {
    id: string;
    token?: string;
    end2endKey?: string;
    password?: string;
  }): Promise<{
    body: Buffer;
    name: string;
    contentType: string;
  }> {
    await this.validator.download(payload);
    const { id, end2endKey, password, token } = payload;
    const _id = this.protocol.end2end.decryptFileName(id); //Decrypt ID content
    await this.validator.isMongoId(_id);
    const content: IContent = await this.protocol.SCO01(
      await this.getById(_id)
    );
    if (!(await this.protocol.isFile(content.type)))
      throw new InvariantError('File not found!');
    let member: IMembership;
    if (token) {
      member = await this.protocol.ACS101(token);
    } else {
      member = this.PUBLIC_MEMBERSHIP;
    }
    const isPublic = await this.protocol.isPublic(content.isPublic);
    const isOwner = member._id === content.membershipId;
    const isMemberShared = await this.isMemberShared(member._id!, content);
    if (content.end2end) {
      await this.protocol.isOwner(member._id!, content.membershipId);
      if (end2endKey === '' || !end2endKey)
        throw new InvariantError(
          "Content is E2E mode, 'end to end key' is required!"
        );
    } else {
      if (!isOwner || content.membershipId === 'public') {
        if (!isMemberShared && !isPublic && content.membershipId !== 'public')
          throw new AuthorizationError('Content is private!');

        // Validasi apakah ada password didalam content
        await this.protocol.isCorrectPassword(content.password, password!);
        await this.protocol.isContentActive(content.status);
        await this.protocol.isContentExpired(content.expired);
        await this.protocol.isContentLimit(
          content.logFile.length,
          content.limit
        );

        await this.model.addLogFile(_id, member._id!);
      }
    }

    const data = await this.storageEngine.download(content.key!, end2endKey);
    const output = {
      body: data,
      name: this.protocol.end2end.decryptFileName(content.encryptName),
      contentType: content.contentType
    };
    return output;
  }

  public async deleteFile(_id: string): Promise<unknown> {
    await this.validator.isMongoId(_id);
    const content: IContent = await this.getById(_id);
    const _data = await this.storageEngine.delete(content._id!);
    await this.deletePermanent(_id);
    return _data;
  }

  public async getAll(): Promise<IContent[]> {
    return await this.model.getAll();
  }

  public async getAllFiles(): Promise<IContent[]> {
    return await this.model.find({ type: Content.FILE });
  }

  public async getAllDirectories(): Promise<IContent[]> {
    return await this.model.find({ type: Content.DIRECTORY });
  }

  public async deletePermanent(_id: string): Promise<string> {
    await this.validator.isMongoId(_id);

    const query = await this.model.delete(_id);
    if (!query) throw new InvariantError('Content not found!');

    return _id;
  }

  public async getById(_id: string): Promise<IContent> {
    await this.validator.isMongoId(_id);
    const query = await this.model.getById(_id);

    if (!query) throw new InvariantError('Content not found!');
    return query;
  }

  public async addDirectory(payload: {
    token: string;
    name: string;
    directory?: string;
    password?: string;
    easyUrl?: string;
    limit?: number;
    expired?: number;
    isPublic?: boolean;
  }): Promise<IUploadResponse> {
    if (
      !payload.name ||
      payload.name === '' ||
      typeof payload.name !== 'string'
    )
      throw new InvariantError('Name invalid value!');
    const {
      directory,
      easyUrl: payloadEasyUrl,
      expired,
      isPublic,
      limit,
      password
    } = await this.validator.addDirectory(payload);
    const member: IMembership = await this.protocol.ACS101(payload.token);
    const code = await this.createCode();
    const easyUrl = payloadEasyUrl || code;

    const content = await this.model.save({
      membershipId: member._id!,
      directory,
      password,
      type: Content.DIRECTORY,
      contentType: FileConfig.DIRECTORY_EXT,
      sizeString: '0KB',
      size: 0,
      easyUrl,
      code,
      encryptName: this.protocol.end2end.encryptFileName(payload.name),
      limit,
      expired,
      isPublic,
      key: '',
      extension: FileConfig.DIRECTORY_EXT,
      appVersion: this.APP_VERSION,
      end2end: false,
      logFile: [],
      shared: [],
      location: AwsConfig.AWS_BUCKET_NAME,
      status: FileStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return {
      _id: content._id!,
      name: payload.name,
      size: content.size,
      contentType: content.contentType,
      type: content.type,
      sizeString: content.sizeString,
      easyUrl: content.easyUrl,
      code: content.code,
      isPublic: content.isPublic,
      limit: content.limit,
      expired: content.expired,
      end2end: content.end2end,
      link: `${content._id!}`,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      appVersion: content.appVersion
    };
  }

  public async getOwnDirectory(payload: {
    _id?: string;
    token?: string;
    password?: string;
  }): Promise<IOutputDirectory> {
    await this.validator.getOwnDirectory(payload);
    const { token, _id, password } = payload;
    if (!_id) {
      // Root
      const member: IMembership = await this.protocol.ACS101(token);
      return this.getRootDirectory(member);
    } else {
      let member: IMembership;
      if (token) {
        member = await this.protocol.ACS101(token);
      } else {
        member = this.PUBLIC_MEMBERSHIP;
      }
      const content: IContent = await this.protocol.SCO01(
        await this.getById(_id)
      );
      if (!(await this.protocol.isDirectory(content.type)))
        throw new InvariantError('Directory not found!');
      const isPublic = await this.protocol.isPublic(content.isPublic);

      if (!isPublic) {
        // jika bukan public maka cek apakah member adalah pemilik content
        // jika pemilik maka langsung bubka folder
        await this.protocol.isOwner(member._id!, content.membershipId);
      } else {
        // Validasi apakah ada password didalam content
        await this.protocol.isCorrectPassword(content.password, password!);
        await this.protocol.isContentActive(content.status);
        await this.protocol.isContentExpired(content.expired);
        await this.protocol.isContentLimit(
          content.logFile.length,
          content.limit
        );
      }

      const output: IOutputDirectory = await this.outputDirectory(
        content,
        content.membershipId
      );

      return output;
    }
  }

  public async infoUser(token: string): Promise<{
    publicAddress: string;
    remainingExpired: string;
    remainingStorage: string;
    usedStorage: string;
  }> {
    token = token.split(' ')[1];
    const member = this.protocol.tokenize.decodeAccessToken(token);

    if (!member) throw new InvariantError('Public address not found!');
    const { expired, storage } = member;
    const nowUsed = await this.calculateStorage(member._id!.toString());
    const dataNow = new Date();

    return {
      remainingExpired: this.millsToTime(expired - dataNow.getTime()),
      remainingStorage: bytes(storage - nowUsed),
      usedStorage: bytes(nowUsed),
      publicAddress: member.publicAddress
    };
  }

  public async shortLink(link: string): Promise<{
    link: string;
    name: string;
    type: string;
    size?: string;
    id: string;
    isPassword: boolean;
    isEnd2End: boolean;
  }> {
    await this.validator.shortLink(link);
    let content: IContent;
    const easyUrl: IContent[] = await this.model.find({
      easyUrl: link
    });
    const code: IContent[] = await this.model.find({ code: link });

    if (code.length) content = code[0];
    else if (easyUrl.length) content = easyUrl[0];
    else throw new NotFoundError('Content not found!');
    let totalCount = 0;
    if (content.type === Content.DIRECTORY) {
      const _count = this.countContent(
        await this.model.find({ directory: content._id! })
      );

      totalCount = _count.directory + _count.file;
    }
    const data: {
      link: string;
      name: string;
      type: string;
      size: string;
      id: string;
      isPassword: boolean;
      isEnd2End: boolean;
    } = {
      link:
        content.type === Content.FILE
          ? `${this.protocol.end2end.encryptFileName(content._id!.toString())}`
          : `${content._id!.toString()}`,
      name: this.protocol.end2end.decryptFileName(content.encryptName),
      type: content.type,
      size:
        content.type === Content.FILE
          ? content.sizeString
          : `${totalCount} Items`,
      id: content._id!.toString(),
      isPassword: content.password !== '' ? true : false,
      isEnd2End: content.end2end
    };

    return data;
  }

  public async calculateStorage(membershipId: string): Promise<number> {
    await this.validator.calculateStorage(membershipId);
    const query = await this.model.find({
      membershipId,
      status: FileStatus.ACTIVE
    });
    if (!query.length) return 0;
    return query.reduce((a, b) => a + b.size, 0);
  }

  public async terminate(payload: {
    token: string;
    _id: string;
  }): Promise<IContent> {
    await this.validator.crud(payload);
    const { token, _id } = payload;
    const member: IMembership = await this.protocol.ACS101(token);
    await this.protocol.OWN101(await this.getById(_id), member._id!);

    const query = await this.model.updateById(_id, {
      status: FileStatus.TRASH
    });

    await this.model.update({ directory: _id }, { status: FileStatus.TRASH });

    if (!query) throw new InvariantError('Content not found!');

    if (query.status !== FileStatus.TRASH) {
      throw new InvariantError('Failed send content to trash!');
    }

    return query;
  }
  public async restore(payload: {
    token: string;
    _id: string;
  }): Promise<IContent> {
    await this.validator.crud(payload);
    const { token, _id } = payload;
    const member: IMembership = await this.protocol.ACS101(token);
    await this.protocol.OWN101(await this.getById(_id), member._id!);
    const query = await this.model.updateById(_id, {
      status: FileStatus.ACTIVE
    });

    await this.model.update({ directory: _id }, { status: FileStatus.ACTIVE });

    if (!query) throw new InvariantError('Content not found!');

    if (query.status !== FileStatus.ACTIVE) {
      throw new InvariantError('Restoring content failed!');
    }

    return query;
  }
  public async delete(payload: {
    token: string;
    _id: string;
  }): Promise<IContent> {
    const { token, _id } = payload;
    await this.validator.crud(payload);
    const member: IMembership = await this.protocol.ACS101(token);
    await this.protocol.OWN101(await this.getById(_id), member._id!);
    const query = await this.model.updateById(_id, {
      status: FileStatus.DELETED
    });
    await this.model.update({ directory: _id }, { status: FileStatus.DELETED });

    if (!query) throw new InvariantError('Content not found!');

    if (query.status !== FileStatus.DELETED) {
      throw new InvariantError('Deleting content filed!');
    }

    return query;
  }

  public async rename(payload: {
    token: string;
    _id: string;
    name: string;
  }): Promise<IContent> {
    await this.validator.rename(payload);
    const { token, _id, name } = payload;
    const member: IMembership = await this.protocol.ACS101(token);
    await this.protocol.OWN101(await this.getById(_id), member._id!);

    const encryptName = this.protocol.end2end.encryptFileName(name);

    const query = await this.model.updateById(_id, { encryptName });
    if (!query) throw new InvariantError('Content not found!');
    if (this.protocol.end2end.decryptFileName(query.encryptName) !== name)
      throw new InvariantError('Sorry, change name failed!');

    return query;
  }

  public async copy(payload: {
    token: string;
    _id: string;
    directoryDestination: string;
  }): Promise<IContent> {
    await this.validator.copy(payload);
    const { token, _id, directoryDestination } = payload;
    const member: IMembership = await this.protocol.ACS101(token);
    if (directoryDestination !== 'root') {
      const _directory = await this.protocol.OWN101(
        await this.getById(directoryDestination),
        member._id!
      );
      if (_directory.type !== Content.DIRECTORY)
        throw new InvariantError('Directory destination not found!');
    }
    const content: IContent = await this.protocol.OWN101(
      await this.getById(_id),
      member._id!
    );

    if (content.type === Content.FILE)
      return await this.copyFiles(_id, directoryDestination);
    else if (content.type === Content.DIRECTORY)
      return await this.copyDirectory(_id, directoryDestination);
    else throw new InvariantError('Copy content error!');
  }

  public async move(payload: {
    token: string;
    _id: string;
    directoryDestination: string;
  }): Promise<IContent> {
    await this.validator.move(payload);
    const { token, _id, directoryDestination } = payload;

    if (payload.directoryDestination === 'root') {
      const query = await this.model.updateById(_id, {
        directory: 'root'
      });
      if (!query) throw new InvariantError('Content not found!');
      return query;
    }
    const member: IMembership = await this.protocol.ACS101(token);
    const content = await this.getById(directoryDestination);
    if (content.type !== Content.DIRECTORY)
      throw new InvariantError('Directory not found!');
    await this.protocol.OWN101(content, member._id!);
    await this.protocol.OWN101(await this.getById(_id), member._id!);
    const query = await this.model.updateById(_id, {
      directory: directoryDestination
    });
    if (!query) throw new InvariantError('Content not found!');
    if (query.directory !== directoryDestination)
      throw new InvariantError('Move content failed!');

    return query;
  }

  public async share(payload: {
    token: string;
    _id: string;
    membershipId: string;
  }): Promise<string> {
    await this.validator.share(payload);
    const { token, _id, membershipId } = payload;
    // Check eksistensi membership
    const targetShare = await this.membershipService.getById(membershipId);
    if (targetShare.memberStatus !== MemberStatus.Active)
      throw new InvariantError('Target share not found/not active!');
    const checkOwner: IMembership = await this.protocol.ACS101(token);

    if (checkOwner._id! === membershipId)
      throw new InvariantError('Share file must be not your id.');
    const content = await this.getById(_id);
    if (content.end2end)
      throw new AuthorizationError('Cannot share content is e2e encryption.');
    await this.protocol.OWN101(content, checkOwner._id!);
    const query = await this.model.addShared(_id, membershipId);
    if (!query) throw new InvariantError('Sharing content failed!');

    return membershipId;
  }

  public async oneTimeContent(payload: {
    token: string;
    _id: string;
  }): Promise<string> {
    const { _id, token } = payload;
    await this.validator.isMongoId(_id);
    const member: IMembership = await this.protocol.ACS101(token);
    await this.protocol.OWN101(await this.getById(_id), member._id!);
    return this.oneTimeWithId(_id);
  }

  public async updateFeatures(payload: {
    _id: string;
    token: string;
    password?: string;
    tempPassword?: string;
    limit?: number;
    expired?: number;
  }): Promise<IContent> {
    await this.validator.updateFeatures(payload);
    const {
      token,
      _id,
      expired,
      limit: lim,
      password: pass
      // tempPassword
    } = payload;
    const member: IMembership = await this.protocol.ACS101(token);
    await this.protocol.OWN101(await this.getById(_id), member._id!);
    const content = await this.getById(_id);
    if (content.end2end)
      throw new AuthorizationError('Cannot update content is e2e encryption.');
    let password: string | undefined;
    let limit: number | undefined;
    if (pass && pass !== '') {
      if (typeof pass !== 'string')
        throw new InvariantError('Password invalid value!');
      // tODO add confirm old password
      // if (!tempPassword || typeof tempPassword !== 'string')
      //   throw new InvariantError('Wrong old password!');
      // await this.protocol.isCorrectPassword(content.password, tempPassword);
      password = await this.protocol.end2end.sha256(pass);
    }
    if (lim && lim !== 0) {
      if (typeof lim !== 'number')
        throw new InvariantError('Limit invalid payload!');
      limit = content.logFile.length + lim;
    }
    if (expired && expired !== 0) {
      if (expired < Date.now())
        throw new InvariantError('Expired invalid payload!');
    }

    const data = await this.model.updateById(_id, {
      expired,
      limit,
      password,
      isPublic: true
    });

    if (!data) throw new InvariantError('Content not found!');

    return data;
  }

  private getExtension(filename: string) {
    const i = filename.lastIndexOf('.');
    return i < 0 ? '' : filename.substring(i);
  }

  private async isMemberShared(
    membershipId: string,
    content: IContent
  ): Promise<boolean> {
    const query = content.shared.filter(
      (shared) => shared.membershipId === membershipId
    );
    if (query.length) {
      return true;
    }

    return false;
  }

  private async availableContent(
    membershipId: string,
    directory: string
  ): Promise<IContent[]> {
    const contents: IContent[] = await this.model.find({
      membershipId,
      directory
    });
    const result = await Promise.all(
      contents.filter(
        (content: IContent) => content.status === FileStatus.ACTIVE
      )
    );

    return result;
  }

  private countContent(contents: IContent[]): {
    file: number;
    directory: number;
  } {
    const filter = (type: Content) => contents.filter((c) => c.type === type);

    return {
      file: filter(Content.FILE).length,
      directory: filter(Content.DIRECTORY).length
    };
  }

  private async outputDirectory(
    content: IContent,
    membershipId: string
  ): Promise<IOutputDirectory> {
    let _contents: IContent[] = await this.availableContent(
      content.membershipId,
      content._id! || 'root'
    );
    const isMemberShared: boolean = await this.isMemberShared(
      membershipId,
      content
    );
    const isOwner: boolean = content.membershipId === membershipId;

    if (!isOwner && !isMemberShared) {
      _contents = _contents.filter((content) => content.isPublic === true);
    }

    const contents: (IOutputFile | IOutputDirectory)[] = await Promise.all(
      _contents.map(async (content) => {
        let _content: IOutputFile | IOutputDirectory;
        const {
          _id,
          membershipId,
          contentType,
          size,
          sizeString,
          extension,
          encryptName,
          type,
          end2end,
          isPublic,
          directory,
          code,
          easyUrl,
          limit,
          expired,
          status,
          shared,
          logFile,
          createdAt,
          updatedAt
        } = content;

        if (content.type === Content.DIRECTORY) {
          const _contents = await this.availableContent(
            content.membershipId,
            content._id!
          );
          const _totalContent = this.countContent(_contents);

          _content = {
            _id: content._id!,
            owner: content.membershipId,
            isOwner,
            easyUrl,
            code,
            isPassword: content.password !== '' ? true : false,
            name: this.protocol.end2end.decryptFileName(content.encryptName),
            type: content.type,
            directory: content.directory,
            totalContent: _totalContent,
            isPublic: content.isPublic,
            link: `${content._id!}`,
            createdAt: content.createdAt!,
            updatedAt: content.createdAt!
          };
        } else {
          _content = {
            _id: _id!,
            isOwner: true,
            owner: membershipId,
            contentType,
            size,
            sizeString,
            ext: extension,
            name: this.protocol.end2end.decryptFileName(encryptName),
            type,
            isPublic,
            isEnd2End: end2end,
            isPassword: content.password !== '' ? true : false,
            directory,
            code,
            easyUrl,
            limit: limit - logFile.length > 0 ? limit - logFile.length : 0, //* limit remaining
            expired,
            status,
            link: `${this.protocol.end2end.encryptFileName(
              content._id!.toString()
            )}`,
            shared,
            logFile,
            createdAt,
            updatedAt
          };
        }
        return _content;
      })
    );

    const totalContent = this.countContent(_contents);
    const sortContents =
      contents?.sort((a, b) => a.type.localeCompare(b.type)) ?? []; //* sort alphabetically

    const data: IOutputDirectory = {
      _id: content._id!,
      owner: content.membershipId,
      isOwner,
      easyUrl: content.easyUrl,
      code: content.code,
      name: this.protocol.end2end.decryptFileName(content.encryptName),
      type: content.type,
      directory: content.directory,
      totalContent,
      isPassword: content.password !== '' ? true : false,
      contents: sortContents,
      isPublic: content.isPublic,
      createdAt: content.createdAt,
      updatedAt: content.createdAt
    };

    return data;
  }

  private async generateCode(length: number): Promise<string> {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private async copyFiles(_id: string, directory: string): Promise<IContent> {
    const query = await this.getById(_id);

    const clone = await this.model
      .clone(query, directory, await this.createCode())
      .catch((e) => {
        console.log(`Clone error: ${e}`);
        throw new InvariantError('Copy file error!');
      });
    if (!clone) throw new InvariantError('Copy file error!');

    return query;
  }

  private async copyDirectory(
    _id: string,
    directory: string
  ): Promise<IContent> {
    const query = await this.getById(_id); //* Get directory you want copy
    const clone = await this.model
      .clone(query, directory, await this.createCode())
      .catch((e) => {
        console.log(`Clone error: ${e}`);
        throw new InvariantError('Copy directory error!');
      }); //* Clone the directory

    if (!clone) throw new InvariantError('Copy directory error!');

    const _data = await this.model.find({
      directory: _id
    }); //* Find all content of directory you want copy

    //* Destructuring object all files cloning
    const data: IContent[] = await Promise.all(
      _data.map(async (content) => {
        const code = await this.createCode();
        const _dataTemp = content;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, logFile, shared, ..._data } = {
          ..._dataTemp,
          code,
          easyUrl: code,
          directory: clone._id!,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        return { ..._data, logFile: [], shared: [] };
      })
    );
    const result = await this.model.insertMany(data);
    if (result.length) throw new InvariantError('Copy directory error!');

    return clone;
  }

  private async checkCodeAndEasyUrl(codeOrEasyUrl: string): Promise<boolean> {
    const query1 = await this.model.find({ code: codeOrEasyUrl });
    if (query1.length) {
      return true;
    }
    const query2 = await this.model.find({ easyUrl: codeOrEasyUrl });
    if (query2.length) {
      return true;
    }

    return false;
  }

  private async createCode(): Promise<string> {
    let result = '';
    while (true) {
      const code = await this.generateCode(FileConfig.CODE_LENGTH);
      const check = await this.checkCodeAndEasyUrl(code);
      if (!check) {
        result = code;
        break;
      }
    }
    return result;
  }

  private async oneTimeWithId(_id: string): Promise<string> {
    const content = await this.getById(_id);
    const _limit = content.logFile.length;
    const limit = _limit + 1;
    const updateLimit = await this.model.updateLimitContent(_id, limit);
    if (!updateLimit)
      throw new InvariantError('Change to OneTimeFile features failed!');

    return _id;
  }

  private async oneTimeWithContent(content: IContent): Promise<string> {
    const _limit = content.logFile.length;
    const limit = _limit + 1;
    const updateLimit = await this.model.updateLimitContent(
      content._id!,
      limit
    );

    if (!updateLimit)
      throw new InvariantError('Change to OneTimeFile features failed!');

    return content._id!;
  }

  private async getRootDirectory(
    membership: IMembership
  ): Promise<IOutputDirectory> {
    return await this.outputDirectory(
      {
        appVersion: this.APP_VERSION,
        code: '',
        contentType: Content.DIRECTORY,
        createdAt: new Date(),
        directory: '',
        easyUrl: '',
        encryptName: this.protocol.end2end.encryptFileName('root'),
        end2end: false,
        expired: membership.expired,
        extension: FileConfig.DIRECTORY_EXT,
        isPublic: false,
        limit: 0,
        location: '',
        logFile: [],
        membershipId: membership._id!,
        password: '',
        shared: [],
        size: 0,
        sizeString: '',
        status: FileStatus.ACTIVE,
        type: Content.DIRECTORY,
        updatedAt: new Date(),
        _id: '',
        key: ''
      },
      membership._id!
    );
  }

  private millsToTime(ms: number): string {
    const seconds = (ms / 1000).toFixed(1);
    const minutes = (ms / (1000 * 60)).toFixed(1);
    const hours = (ms / (1000 * 60 * 60)).toFixed(1);
    const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (parseInt(seconds) < 60) return seconds + ' Sec';
    else if (parseInt(minutes) < 60) return minutes + ' Min';
    else if (parseInt(hours) < 24) return hours + ' Hrs';
    else return days + ' Days';
  }
}
