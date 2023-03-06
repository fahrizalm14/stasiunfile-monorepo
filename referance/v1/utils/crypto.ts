// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import elliptic from 'elliptic';

// import * as crypto from "crypto";
export const ellip = new elliptic.ec('secp256k1');

// export const generateRandom = (length: number) =>
//   crypto.randomBytes(length).toString("hex");
