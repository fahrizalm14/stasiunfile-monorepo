// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { MEMBER_EXPIRED } from '@config';
import { AuthenticationError, InvariantError, NotFoundError } from '@error';
import IAuthService from '@interfaces/IAuthService';
import IMembership from '@interfaces/IMembership';
import IMembershipService from '@interfaces/IMembershipService';
import { IResRegisterOrLogin } from '@interfaces/IResponse';
import JsonToken from '@plugins/JsonToken';
import Wallet from '@plugins/Wallet';
import web3 from '@utils/Web3';
import { MEMBER_STORAGE } from '../../config/index';
import AuthResponseAdapter from './adapter/AuthResponseAdapter';
import AuthValidation from './validation';

/**
 * @class AuthService
 * @param service IMembershipService
 * @implements IAuthService
 * @interface IAuthService
 * @instance IMembershipService
 */
export default class AuthServices implements IAuthService {
  private FIRST_NUMBER = '0000'; // phoneNumber helper
  private MESSAGE = 'I am signing my one-time nonce: '; // Message for generate and verifying Signature
  private tokenize: JsonToken = new JsonToken(); // Tokenize instance generate and verifying token
  private wallet: Wallet = new Wallet(); // Wallet instance generate and verifying signature regular login/register
  private web3: typeof web3 = web3; // Web3 instance generate and verifying signature web3 login/register
  private validator: AuthValidation = new AuthValidation(); // Validator AuthService instance

  /**
   * @constructor
   * @param membershipService IMembershipService
   */
  constructor(private readonly membershipService: IMembershipService) {}

  // TODO add test mobileLogin and validator
  public async mobileLogin(
    address: string,
    signature: {
      v: string;
      r: string;
      s: string;
    }
  ): Promise<IResRegisterOrLogin> {
    const { r, s, v } = signature;

    if (!r || !s || !v || !address) {
      throw new InvariantError('Payload invalid value');
    }

    if (
      typeof r !== 'string' ||
      typeof s !== 'string' ||
      typeof v !== 'string' ||
      typeof address !== 'string'
    ) {
      throw new InvariantError('Payload invalid value');
    }

    const publicAddress = address.toLowerCase();

    const nonce: number = Date.now(); //for nonce
    // Get member by publicAddress with service instance
    const member: IMembership | null =
      await this.membershipService.getByPublicAddress(publicAddress);
    if (!member) throw new InvariantError('Public address not found!');
    // Generating message with nonce by querying member
    const msg: string = await this.generateMessage(member.nonce);

    const verifyPublicAddress = await this.generateSignatureMobile({
      r,
      s,
      v,
      msg
    });

    // Comparing publicAddress with verifyPublicAddress
    if (verifyPublicAddress.toLowerCase() !== publicAddress) {
      throw new AuthenticationError('Signature invalid!');
    }

    //Update nonce implements one time login (if new login must preLogin protocol)
    const { expired, phoneNumber, _id, storage } =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.membershipService.updateById(member._id!.toString(), {
        nonce
      });

    // Generating token
    const token: string = await this.generateToken(member);

    // Generating refreshToken
    const refreshToken: string = this.tokenize.generateRefreshToken(
      publicAddress,
      nonce.toString()
    );

    // Output this method
    const output: IResRegisterOrLogin = new AuthResponseAdapter({
      expired,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      membershipId: _id!,
      phoneNumber,
      publicAddress,
      refreshToken,
      storage,
      token
    });

    return output; // return output
  }

  public async generateSignatureMobile(signature: {
    v: string;
    r: string;
    s: string;
    msg: string;
  }): Promise<string> {
    const { msg, r, s, v } = signature;
    const messageHash = this.web3.utils.sha3(msg);
    if (!messageHash) throw new AuthenticationError('Signature not valid!');
    const publicAddress = this.web3.eth.accounts.recover({
      r: `0x${r}`,
      s: `0x${s}`,
      v: `0x${v}`,
      messageHash
    });
    return publicAddress.toLocaleLowerCase();
  }

  /**
   * regular registration new membership, save publicAddress
   * and phoneNumber to database with service instance.
   * @method register
   * @param publicAddress string
   * @param phoneNumber string
   * @returns `Promise<IResRegisterOrLogin>`
   * @throws InvariantError("Register failed!")
   * @throws InvariantError("Public address invalid value!")
   * @throws InvariantError("Phone number invalid value!")
   */
  public async register(
    publicAddress: string,
    phoneNumber: string
  ): Promise<IResRegisterOrLogin> {
    // Validating value publicAddress and phoneNumber
    await this.validator.register(publicAddress, phoneNumber);

    // Checking registered phoneNumber and throwing error if exist
    await this.membershipService.checkPhoneNumber(phoneNumber);
    // Saving publicAddress and phoneNumber as membership with service instance
    const newMember: IMembership = await this.membershipService.save({
      publicAddress: publicAddress.toLowerCase(),
      phoneNumber,
      storage: 0,
      expired: 0
    });

    // Generating token
    const token: string = await this.generateToken(newMember);

    // Generating refreshToken
    const refreshToken: string = this.tokenize.generateRefreshToken(
      publicAddress,
      newMember.nonce
    );

    // Output this method
    const output: IResRegisterOrLogin = new AuthResponseAdapter({
      expired: newMember.expired,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      membershipId: newMember._id!,
      phoneNumber,
      publicAddress,
      refreshToken,
      storage: newMember.storage,
      token
    });

    return output; // returning output
  }

  /**
   * Pre login generating message for web3 login and
   * if unregistered this method auto registering `publicAddress`
   * and save publicAddress to database with service instance.
   * @method preLogin
   * @param address string
   * @returns `Promise<string>` message
   * @throws InvariantError("Register failed!")
   * @throws InvariantError("Public address invalid value!")
   */
  public async preLogin(address: string): Promise<string> {
    // Validating value publicAddress
    await this.validator.preLogin(address);
    const publicAddress = address.toLowerCase();

    const dateNow: number = Date.now(); // for nonce
    let nonce: string; //nonce
    // TODO add validation publicAddress
    // Get member by publicAddress with service instance
    const member: IMembership | null =
      await this.membershipService.getByPublicAddress(publicAddress);
    // If membership exist
    if (member) {
      nonce = member.nonce;
      if (member.storage !== 1099511627776) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await this.membershipService.updateById(member._id!.toString(), {
          storage: 1099511627776,
          expired: Date.now() + 2629743000
        });
      }
    }
    // If not membership
    else {
      //TODO set new member as active
      const { nonce: _nonce }: IMembership = await this.membershipService.save({
        publicAddress,
        phoneNumber: `${this.FIRST_NUMBER}${dateNow}`,
        storage: MEMBER_STORAGE,
        expired: Date.now() + MEMBER_EXPIRED
      });
      // .catch((e) => {
      //   console.log(`auth.preLogin error: ${e.message}`);
      //   throw new InvariantError("Register failed!");
      // });
      nonce = _nonce;
    }
    // Generating message for login web3 protocol
    const message = await this.generateMessage(nonce);

    return message; //return message
  }

  /**
   * regular login, verifying signature and resulting token
   * (token and refreshToken).
   * @method login
   * @param publicAddress string
   * @param message string
   * @param signature string
   * @returns `Promise<IResRegisterOrLogin>`
   * @throws NotFoundError("Public address not found!")
   * @throws InvariantError("Public address invalid value!")
   * @throws InvariantError("Message invalid value!")
   * @throws InvariantError("Signature invalid value!")
   */
  public async login(
    publicAddress: string,
    message: string,
    signature: string
  ): Promise<IResRegisterOrLogin> {
    // Validating value publicAddress, signature and message
    await this.validator.login(publicAddress, message, signature);

    // Get member by publicAddress with service instance
    const member: IMembership | null =
      await this.membershipService.getByPublicAddress(publicAddress);
    if (!member) throw new NotFoundError('Public address not found!');

    // verifying publicAddress, signature and message
    const verifySignature = this.wallet.verifySignature(
      publicAddress,
      signature,
      message
    );

    // Throwing error if signature invalid
    if (!verifySignature) {
      throw new AuthenticationError('Signature invalid!');
    }

    // Generating token
    const token: string = await this.generateToken(member);
    // Generating refreshToken
    const refreshToken: string = this.tokenize.generateRefreshToken(
      member.publicAddress,
      member.nonce
    );

    // Output this method
    const output: IResRegisterOrLogin = new AuthResponseAdapter({
      expired: member.expired,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      membershipId: member._id!,
      phoneNumber: member.phoneNumber,
      publicAddress,
      refreshToken,
      storage: member.storage,
      token
    });

    return output; //return output
  }

  /**
   * Login with web3 protocol, verifying signature and resulting token
   * (token and refreshToken).
   * @method web3Login
   * @param address string
   * @param signature string
   * @returns `Promise<IResRegisterOrLogin>`
   * @throws InvariantError("Signature invalid value!")
   */
  public async web3Login(
    address: string,
    signature: string
  ): Promise<IResRegisterOrLogin> {
    // Validating value publicAddress and signature
    await this.validator.web3Login(address, signature);
    const publicAddress = address.toLowerCase();

    const nonce: number = Date.now(); //for nonce
    // Get member by publicAddress with service instance
    const member: IMembership | null =
      await this.membershipService.getByPublicAddress(publicAddress);
    if (!member) throw new InvariantError('Public address not found!');
    // Generating message with nonce by querying member
    const message: string = await this.generateMessage(member.nonce);

    // verifying publicAddress and outputting publicAddress
    const verifyPublicAddress = this.web3.eth.accounts.recover(
      message,
      signature
    );

    // Comparing publicAddress with verifyPublicAddress
    if (verifyPublicAddress.toLowerCase() !== publicAddress) {
      throw new AuthenticationError('Signature invalid!');
    }
    //Update nonce implements one time login (if new login must preLogin protocol)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.membershipService.updateById(member._id!.toString(), { nonce });

    // Generating token
    const token: string = await this.generateToken(member);

    // Generating refreshToken
    const refreshToken: string = this.tokenize.generateRefreshToken(
      publicAddress,
      nonce.toString()
    );
    // Output this method
    const output: IResRegisterOrLogin = new AuthResponseAdapter({
      expired: member.expired,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      membershipId: member._id!,
      phoneNumber: member.phoneNumber,
      publicAddress: publicAddress.toLowerCase(),
      refreshToken,
      storage: member.storage,
      token
    });

    return output; // return output
  }

  // TODO add test refreshToken
  public async refreshToken(token?: string): Promise<IResRegisterOrLogin> {
    await this.validator.refreshToken(token);
    const verify = this.tokenize.verifyToken(token);
    // Get member by publicAddress with service instance
    const member: IMembership | null =
      await this.membershipService.getByPublicAddress(verify.publicAddress);
    if (!member) throw new AuthenticationError('Public address not found!');

    // Generating token
    const newToken: string = await this.generateToken(member);
    // TODO Validation refreshToken/nonce
    // Generating refreshToken
    const refreshToken: string = this.tokenize.generateRefreshToken(
      verify.publicAddress,
      verify.nonce
    );
    // Output this method
    const output: IResRegisterOrLogin = new AuthResponseAdapter({
      expired: member.expired,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      membershipId: member._id!,
      phoneNumber: member.phoneNumber,
      publicAddress: verify.publicAddress.toLowerCase(),
      refreshToken,
      storage: member.storage,
      token: newToken
    });

    return output; // return output
  }

  /**
   * Generating signature to login with web3 protocol.
   * @method generateSignatureWeb3
   * @param key string
   * @param message string
   * @returns `Promise<string>`
   * @throws InvariantError("Message invalid value!")
   * @throws InvariantError("Key invalid value!")
   */
  public async generateSignatureWeb3(
    key: string,
    message: string
  ): Promise<string> {
    // Validating value key and message
    await this.validator.generateSignatureWeb3(key, message);

    // Signing message and resulting signature for web3 login protocol
    const { signature } = this.web3.eth.accounts.sign(message, key);
    return signature; //return signature
  }

  /**
   * Generating token.
   * @method generateToken
   * @param membership IMembership
   * @returns `Promise<string>`
   */
  private async generateToken(membership: IMembership): Promise<string> {
    // Generating token with tokenize
    return this.tokenize.generateAccessToken({
      _id: membership._id,
      phoneNumber: membership.phoneNumber,
      publicAddress: membership.publicAddress,
      memberStatus: membership.memberStatus,
      nonce: membership.nonce,
      expired: membership.expired,
      storage: membership.storage
    });
  }

  /**
   * Generating message.
   * @method generateMessage
   * @param nonce string
   * @returns Promise<string>
   */
  private async generateMessage(nonce: string): Promise<string> {
    // Generating message + nonce
    return `${this.MESSAGE + nonce}`;
  }
}
