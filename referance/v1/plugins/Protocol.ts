// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  AuthenticationError,
  AuthorizationError,
  InvariantError
} from '@error';
import IContent from '@interfaces/IContent';
import IMembership from '@interfaces/IMembership';
import IProtocol from '@interfaces/IProtocol';
import JsonToken from '@plugins/JsonToken';
import MembershipService from '@services/membership';
import Encryption from '@utils/Encryption';
import { Content, FileStatus, MemberStatus } from '@utils/type';

export default class Protocol implements IProtocol {
  public tokenize: JsonToken = new JsonToken();
  public end2end: Encryption = new Encryption();
  constructor(private readonly membershipService: MembershipService) {}
  public async decodeTokenDownload(
    tokenDownload: string
  ): Promise<{ id: string; membershipId: string }> {
    return this.tokenize.decodeDownloadToken(tokenDownload);
  }
  public async generateTokenDownload(
    id: string,
    membershipId: string
  ): Promise<string> {
    return this.tokenize.generateDownloadToken(id, membershipId);
  }
  public async ACS101(jwtPayload: string | undefined): Promise<IMembership> {
    if (!jwtPayload || typeof jwtPayload !== 'string') {
      throw new AuthorizationError('Token unauthorized!');
    }
    jwtPayload = jwtPayload.split(' ')[1]; // Remove Bearer from string

    const result: IMembership = this.tokenize.decodeAccessToken(jwtPayload);
    if (!result._id) {
      throw new AuthorizationError('Token unauthorized!');
    }
    if (result.memberStatus === MemberStatus.NotActive) {
      throw new AuthorizationError('Membership not active!');
    } else if (result.memberStatus === MemberStatus.Expired) {
      throw new AuthorizationError('Membership expired!');
    }

    if (result.expired <= Date.now()) {
      await this.membershipService.terminate(result._id);
      throw new AuthorizationError('Membership expired!');
    }
    return result;
  }

  // Seacrch owner
  public async SCO01(content: IContent): Promise<IContent> {
    if (content.membershipId !== 'public') {
      const ownerContent: IMembership = await this.membershipService.getById(
        content.membershipId
      );
      if (ownerContent.memberStatus !== MemberStatus.Active) {
        throw new AuthorizationError(
          "Owner's account has expired or not active!"
        );
      }
      if (ownerContent.expired <= Date.now()) {
        await this.membershipService.terminate(content.membershipId);
        throw new AuthorizationError("Owner's account has expired!");
      }
    }
    return content;
  }
  public async OWN101(
    content: IContent,
    membershipId: string
  ): Promise<IContent> {
    if (content.membershipId !== membershipId) {
      throw new AuthorizationError('You are not the owner!');
    }

    return content;
  }

  public async isPublic(isPublic: boolean): Promise<boolean> {
    if (isPublic) {
      return true;
    }

    return false;
  }

  public async isOwner(membershipId: string, owner: string): Promise<void> {
    if (membershipId !== owner) {
      throw new AuthorizationError('You are not the owner!');
    }
  }

  public async E2E101(membershipId: string, owner: string): Promise<void> {
    if (membershipId !== owner) {
      throw new AuthorizationError('e2e');
    }
  }

  public async isContentActive(status: string): Promise<void> {
    if (status !== FileStatus.ACTIVE) {
      throw new AuthorizationError('Content not active (Trash)!');
    }
  }

  public async isContentLimit(
    logDownload: number,
    limit: number
  ): Promise<void> {
    if (logDownload >= limit) {
      throw new AuthorizationError('Content has reached the limit!');
    }
  }
  public async isContentExpired(expired: number): Promise<void> {
    if (expired <= Date.now()) {
      throw new AuthorizationError('Content expired!');
    }
  }

  public async isCorrectPassword(
    contentPassword: string,
    queryPassword: string
  ): Promise<void> {
    if (contentPassword !== '') {
      if (!queryPassword || queryPassword === '')
        throw new InvariantError('Content is private, password required!');
      const password = await this.end2end.sha256(queryPassword as string);
      if (password !== contentPassword)
        throw new AuthenticationError('Wrong password!');
    }
  }

  public async isFile(type: Content): Promise<boolean> {
    if (type !== Content.FILE) return false;
    return true;
  }

  public async isDirectory(type: Content): Promise<boolean> {
    if (type !== Content.DIRECTORY) return false;
    return true;
  }
}
