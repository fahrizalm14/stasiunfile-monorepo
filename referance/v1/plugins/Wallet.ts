// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { InvariantError } from '@error';
import { ellip } from '@utils/crypto';
import { AccountKey } from '@utils/type';


export default class Wallet {
  public createKey(): AccountKey {
    const keyPair = ellip.genKeyPair();
    const accountKey = {
      publicAddress: keyPair.getPublic().encodeCompressed("hex"),
      key: keyPair.getPrivate("hex"),
    };

    return accountKey;
  }

  public generateSignature(key: string, message: string): string {
    if (key === "" || message === "") {
      throw new InvariantError("key or message required!");
    }
    const keyPairTemp = ellip.keyFromPrivate(key);
    const signature = keyPairTemp.sign(message, "base64");

    return signature.toDER("hex");
  }

  public verifySignature(
    publicAddress: string,
    signature: string,
    message: string
  ): boolean {
    if (signature === "") {
      throw new InvariantError("No signature!");
    }
    try {
      const publicKey = ellip.keyFromPublic(publicAddress, "hex");
      const verifyStatus = publicKey.verify(message, signature);
      return verifyStatus;
    } catch (error) {
      throw new InvariantError("Error verify signature!");
    }
  }
}
