// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import BaseApi from '@api/base';
import ContentService from '@services/content';
import multer from 'multer';

import ContentHandler from './handler';

export default class ContentApi extends BaseApi {
  private readonly storage = multer.diskStorage({
    filename: function (_req, file, cb) {
      cb(null, file.originalname);
    }
  });
  private readonly upload = multer({
    storage: this.storage,
    limits: { fileSize: 2147483648 }
  });
  constructor(
    service: ContentService,
    endpoint = '/content',
    private readonly handler: ContentHandler = new ContentHandler(service)
  ) {
    super(endpoint);
    this.initRoute();
  }

  private initRoute(): void {
    this.router.post('/upload_stream', this.handler.uploadStreamHandler);
    this.router.post(
      '/upload_e2e',
      this.upload.single('file'),
      this.handler.uploadHandler
    );
    this.router.get('/short/:link', this.handler.shortLink);
    this.router.get('/download_e2e/:id', this.handler.downloadHandler);
    this.router.get(
      '/download_stream/:token',
      this.handler.downloadStreamHandler
    );
    this.router.post('/pre_download', this.handler.preDownloadHandler);
    this.router.post('/directory', this.handler.postDirectoryHandler);
    this.router.get('/directory', this.handler.getDirectoryHandler);
    this.router.put('/rename', this.handler.renameHandler);
    this.router.post('/copy', this.handler.copyHandler);
    this.router.put('/move', this.handler.moveHandler);
    this.router.post('/share', this.handler.shareHandler);
    this.router.delete('/:_id/trash', this.handler.trashHandler);
    this.router.delete('/:_id/delete', this.handler.deleteHandler);
    this.router.put('/:_id/restore', this.handler.restoreHandler);
    this.router.put('/:_id/otf', this.handler.oneTimeFileHandler);
    this.router.put('/:_id/private', this.handler.setPrivateHandler);
    this.router.put('/:_id/public', this.handler.setPublicHandler);
    this.router.put('/features', this.handler.updateFeaturesHandler);
    this.router.get('/trash', this.handler.getFromTrashHandler);
    this.router.get('/info', this.handler.getInfoUserHandler);
  }
}
