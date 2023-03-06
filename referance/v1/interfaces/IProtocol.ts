// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IContent from '@interfaces/IContent';
import IMembership from '@interfaces/IMembership';
import { Content } from '@utils/type';

export default interface IProtocol {
  ACS101(jwtPayload: string | undefined): Promise<IMembership>;
  SCO01(content: IContent): Promise<IContent>;
  OWN101(content: IContent, membershipId: string): Promise<IContent>;
  generateTokenDownload(id: string, membershipId: string): Promise<string>;
  decodeTokenDownload(
    tokenDownload: string
  ): Promise<{ id: string; membershipId: string }>;
  isOwner(membershipId: string, owner: string): Promise<void>;
  isContentActive(status: string): Promise<void>;
  isContentLimit(logDownload: number, limit: number): Promise<void>;
  isContentExpired(expired: number): Promise<void>;
  isCorrectPassword(
    contentPassword: string,
    queryPassword: string
  ): Promise<void>;
  isFile(type: Content): Promise<boolean>;
  isDirectory(type: Content): Promise<boolean>;
}
