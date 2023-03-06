/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import BaseHandler from '@api/base/handler';
import { ClientError } from '@error';
import { IMulterFile } from '@interfaces/IContentService';
import ContentService from '@services/content';
import busboy from 'busboy';
import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

export default class ContentHandler extends BaseHandler {
  constructor(private readonly service: ContentService) {
    super();
    this.uploadHandler = this.uploadHandler.bind(this);
    this.uploadStreamHandler = this.uploadStreamHandler.bind(this);
    this.downloadHandler = this.downloadHandler.bind(this);
    this.downloadStreamHandler = this.downloadStreamHandler.bind(this);
    this.postDirectoryHandler = this.postDirectoryHandler.bind(this);
    this.getDirectoryHandler = this.getDirectoryHandler.bind(this);
    this.renameHandler = this.renameHandler.bind(this);
    this.copyHandler = this.copyHandler.bind(this);
    this.moveHandler = this.moveHandler.bind(this);
    this.shareHandler = this.shareHandler.bind(this);
    this.trashHandler = this.trashHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.restoreHandler = this.restoreHandler.bind(this);
    this.oneTimeFileHandler = this.oneTimeFileHandler.bind(this);
    this.updateFeaturesHandler = this.updateFeaturesHandler.bind(this);
    this.shortLink = this.shortLink.bind(this);
    this.getInfoUserHandler = this.getInfoUserHandler.bind(this);
    this.preDownloadHandler = this.preDownloadHandler.bind(this);
    this.getFromTrashHandler = this.getFromTrashHandler.bind(this);
    this.setPrivateHandler = this.setPrivateHandler.bind(this);
    this.setPublicHandler = this.setPublicHandler.bind(this);
  }

  public async getFromTrashHandler(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const token = req.headers.authorization;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const data = await this.service.getFromTrash(token!);
      return super.render(res, 200, {
        status: 'success',
        message: 'Get from trash success!',
        data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async preDownloadHandler(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const token = req.headers.authorization;
      const { password, id } = req.body;
      const { token: data } = await this.service.preDownload({
        token,
        password,
        id
      });

      return super.render(res, 200, {
        status: 'success',
        message: 'Download available!',
        token: data
      });
    } catch (error: any) {
      super.renderError(res, error);
    }
  }

  public async uploadHandler(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const file = req.file as IMulterFile;
      const {
        directory,
        easyUrl,
        end2endKey,
        expired,
        isPublic,
        limit,
        password
      } = req.body;
      await this.service.upload(file, {
        token,
        data: {
          directory,
          easyUrl,
          end2endKey,
          expired,
          isPublic,
          limit,
          password
        }
      });
      return super.render(res, 200, {
        status: 'success',
        message: `${file.originalname} uploaded!`
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async uploadStreamHandler(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const headers = req.headers;
      const storageEngine = this.service.storageEngine;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const contentLength: number = parseFloat(headers['content-length']!);
      if (contentLength <= 919) {
        return super.render(res, 400, {
          status: 'error',
          message: 'File is too small!'
        });
      }

      let { directory } = req.query as { directory: string };
      if (!directory) directory = 'root';
      else {
        if (!isValidObjectId(directory))
          return res.status(400).json({
            status: 'fail',
            message: ' Id invalid value!'
          });
      }
      const bb = busboy({ headers }).on('file', async (_name, file, info) => {
        try {
          let total = 0;
          const data = await storageEngine.uploadStream(
            file,
            info.filename,
            (_total: number) => {
              total += _total;
            }
          );

          const code = await this.service.uploadStream(
            headers.authorization,
            total,
            data.Key,
            directory,
            info.mimeType,
            info.filename
          );
          res.status(200).json({
            status: 'success',
            message: `${info.filename} uploaded!`,
            code
          });
        } catch (error: any) {
          if (error) console.log(error.message);
          if (error instanceof ClientError)
            res.status(error.statusCode).json({
              status: 'fail',
              message: error.message
            });
          else
            res.status(500).json({
              status: 'error',
              message: 'An error occurred trying to process your request!'
            });
        }
      });
      req.pipe(bb);
    } catch (error: any) {
      super.renderError(res, error);
    }
  }

  public async downloadHandler(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const token = req.headers.authorization;
      const { id } = req.params;
      const { end2endKey, password } = req.body;
      const { body, contentType, name } = await this.service.download({
        id,
        token,
        end2endKey,
        password
      });
      res.set({
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename=' + name
      });
      res.send(body);
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async downloadStreamHandler(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const { token } = req.params;
      const { key, contentType, name, size } =
        await this.service.downloadStream(token);
      console.log(size);
      const { Body, ContentLength } =
        await this.service.storageEngine.downloadWithoutEncryption(key);
      res.set({
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename=' + name,
        'Content-Length': ContentLength
      });
      Body.pipe(res);
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async postDirectoryHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const token = req.headers.authorization;

      const { name, directory, easyUrl, expired, isPublic, limit, password } =
        req.body;
      const data = await this.service.addDirectory({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: token!,
        name,
        directory,
        easyUrl,
        expired,
        isPublic,
        limit,
        password
      });
      return super.render(res, 201, {
        status: 'success',
        message: 'Add directory success!',
        data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async getDirectoryHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id, password }: any = req.query;
      const data = await this.service.getOwnDirectory({ token, _id, password });
      return super.render(res, 200, {
        status: 'success',
        message: 'Get directory success!',
        data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async renameHandler(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { id, name } = req.body;
      console.log(id, name);
      await this.service.rename({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: token!,
        _id: id,
        name
      });
      return super.render(res, 200, {
        status: 'success',
        message: 'Rename content success!'
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async copyHandler(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id, directory }: any = req.query;
      await this.service.copy({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: token!,
        _id,
        directoryDestination: directory
      });
      return super.render(res, 200, {
        status: 'success',
        message: 'Copy content success!'
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async moveHandler(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id, directory }: any = req.query;
      await this.service.move({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: token!,
        _id,
        directoryDestination: directory
      });
      return super.render(res, 200, {
        status: 'success',
        message: 'Move content success!'
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async shareHandler(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id, membershipId } = req.body;
      const data = await this.service.share({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: token!,
        _id,
        membershipId
      });
      return super.render(res, 201, {
        status: 'success',
        message: `Share content to ${data} success!`
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async trashHandler(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id } = req.params;
      await this.service.terminate({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: token!,
        _id
      });
      return super.render(res, 200, {
        status: 'success',
        message: `Send content to trash success!`
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async deleteHandler(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id } = req.params;
      await this.service.delete({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: token!,
        _id
      });
      return super.render(res, 200, {
        status: 'success',
        message: `Delete content success!`
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async restoreHandler(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id } = req.params;
      await this.service.restore({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: token!,
        _id
      });
      return super.render(res, 200, {
        status: 'success',
        message: `Restore content success!`
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async oneTimeFileHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id } = req.params;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.service.oneTimeContent({ _id, token: token! });
      return super.render(res, 200, {
        status: 'success',
        message: `One time file active now!`
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async setPublicHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id } = req.params;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.service.setPublic({ _id, token: token! });
      return super.render(res, 200, {
        status: 'success',
        message: `Content is public now!`
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async setPrivateHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id } = req.params;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.service.setPrivate({ _id, token: token! });
      return super.render(res, 200, {
        status: 'success',
        message: `Content is private now!`
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async updateFeaturesHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const token = req.headers.authorization;
      const { _id, expired, limit, password, tempPassword } = req.body;
      await this.service.updateFeatures({
        _id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token: token!,
        expired,
        limit,
        password,
        tempPassword
      });
      return super.render(res, 200, {
        status: 'success',
        message: `Update features success!`
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async shortLink(req: Request, res: Response): Promise<Response> {
    try {
      const { link } = req.params;
      const data = await this.service.shortLink(link);

      return super.render(res, 200, {
        status: 'success',
        message: `Content found!`,
        data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async getInfoUserHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const token = req.headers.authorization;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const data = await this.service.infoUser(token!);

      return super.render(res, 200, {
        status: 'success',
        message: `Membership found!`,
        data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }
}
