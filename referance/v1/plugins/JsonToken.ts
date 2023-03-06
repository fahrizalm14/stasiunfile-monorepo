// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_KEY
} from '@config';
import { AuthenticationError } from '@error';
import IMembership from '@interfaces/IMembership';
import jwt from 'jsonwebtoken';

export default class JsonToken {
  constructor() {
    this.generateAccessToken = this.generateAccessToken.bind(this);
    this.generateRefreshToken = this.generateRefreshToken.bind(this);
    this.decodeAccessToken = this.decodeAccessToken.bind(this);
    this.decodeRefreshToken = this.decodeRefreshToken.bind(this);
  }

  public generateAccessToken(payload: IMembership): string {
    return jwt.sign(payload, ACCESS_TOKEN_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRED
    });
  }

  public generateRefreshToken(publicAddress: string, nonce: string): string {
    return jwt.sign({ publicAddress, nonce }, REFRESH_TOKEN_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRED
    });
  }

  public generateDownloadToken(id: string, membershipId: string): string {
    return jwt.sign({ membershipId, id }, ACCESS_TOKEN_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRED
    });
  }

  public decodeDownloadToken(downloadToken: string): {
    id: string;
    membershipId: string;
  } {
    try {
      const artifact = jwt.verify(downloadToken, ACCESS_TOKEN_KEY) as {
        id: string;
        membershipId: string;
      };
      return artifact;
    } catch (error) {
      throw new AuthenticationError('Download token invalid!');
    }
  }

  public decodeAccessToken(accessToken: string): IMembership {
    try {
      const artifact = jwt.verify(accessToken, ACCESS_TOKEN_KEY) as IMembership;
      return artifact;
    } catch (error) {
      throw new AuthenticationError('Access token invalid!');
    }
  }

  public decodeRefreshToken(refreshToken: string): {
    publicAddress: string;
    nonce: string;
  } {
    try {
      const artifact = jwt.verify(refreshToken, REFRESH_TOKEN_KEY) as {
        publicAddress: string;
        nonce: string;
      };
      return artifact;
    } catch (error) {
      console.log(error);
      throw new AuthenticationError('Refresh token invalid!');
    }
  }

  public verifyToken(token: string | undefined): {
    publicAddress: string;
    nonce: string;
  } {
    if (!token || typeof token !== 'string') {
      throw new AuthenticationError('Token invalid!');
    }
    const decode = this.decodeRefreshToken(token);

    return decode;
  }
}
