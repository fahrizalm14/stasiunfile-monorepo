// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export default interface IDatbase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  drop(): Promise<void>;
}
