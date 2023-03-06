// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { InvariantError, NotFoundError } from '@error';
import IMembership from '@interfaces/IMembership';
import IMembershipModel, {
  IMembershipSave
} from '@interfaces/IMembershipModel';
import IMembershipService from '@interfaces/IMembershipService';
import IRegister from '@interfaces/IRegister';
import { MemberStatus } from '@utils/type';

import MembershipValidation from './validation';

/**
 * @class MembershipService
 * @implements IMembershipService
 * @interface IMembershipService
 * @param model IMembershipModel default(MembershipModel)
 * @instance `validator`: MembershipValidation
 */
export default class MembershipService implements IMembershipService {
  private readonly validator: MembershipValidation = new MembershipValidation();

  constructor(private readonly model: IMembershipModel) {}
  /**
   * Save new membership to database.
   * @method save
   * @param payload string
   * @returns `Promise<IMembership>`
   * @throws InvariantError("Failed saving new membership!")
   * @throws InvariantError("Public address invalid value!")
   * @throws InvariantError("Phone number invalid value!")
   * @throws InvariantError("Storage invalid value!")
   * @throws InvariantError("Expired invalid value!")
   */
  public async save(payload: IRegister): Promise<IMembership> {
    // Validating value payload
    await this.validator.save(payload);
    await this.checkPhoneNumber(payload.phoneNumber);
    // Destructuring payload
    const { publicAddress, phoneNumber, storage, expired } = payload;
    const milisecond: number = Date.now(); //generate milisecond
    const newDate: Date = new Date(); //generate Date
    // TODO promo
    const memberStatus = MemberStatus.Active; //Set membersatus to not active
    // Createing newMember object
    const newMember: IMembershipSave = {
      publicAddress,
      phoneNumber,
      storage,
      expired,
      memberStatus,
      nonce: `$${milisecond}`,
      createdAt: newDate,
      updatedAt: newDate
    };

    // Saving newMember to database and parse membership as output
    const output: IMembership = await this.model.save(newMember);
    // .catch((e) => {
    //   console.log(`save error: ${e.message}`);
    //   throw new InvariantError("Failed saving new membership!");
    // });

    return output; //return output
  }

  /**
   * Get membership info by public address from database
   * @method getByPublicAddress
   * @param publicAddress string
   * @returns `Promise<IMembership>`
   * @throws InvariantError("Public address not found!")
   * @throws InvariantError("Public address invalid value!")
   */
  public async getByPublicAddress(
    publicAddress: string
  ): Promise<IMembership | null> {
    // Validating value publicAddress
    await this.validator.getByPublicAddress(publicAddress);
    // Get membership by publicAddress from database and set as membership
    const membership = await this.model.findOne({ publicAddress });

    return membership; // return membership||null
  }

  /**
   * Get membership info by phoneNumber from database
   * @method checkPhoneNumber
   * @param phoneNumber string
   * @returns Promise<void>
   * @throws InvariantError("Phone number is registered!")
   * @throws InvariantError("Phone number invalid value!")
   */
  public async checkPhoneNumber(phoneNumber: string): Promise<void> {
    // Validating value phoneNumber
    await this.validator.checkPhoneNumber(phoneNumber);
    // Get membership by phoneNumber from database and set result as membership variable
    const membership = await this.model.findOne({ phoneNumber });
    // Throwing error if not found!
    if (membership) throw new InvariantError('Phone number is registered!');
  }

  /**
   *
   * @param _id string
   * @param newData object
   * @returns Promise<IMembership>
   * @throws InvariantError("Id not found!")
   * @throws InvariantError("Id invalid value!")
   */
  public async updateById(_id: string, newData: object): Promise<IMembership> {
    // Checking _id and newData value
    await this.validator.updateById(_id, newData);
    // Updating newData to database and set result as membership variable
    const membership = await this.model.updateById(_id, newData);
    // Throwing error if not found!
    if (!membership) throw new NotFoundError('Membership not found!');

    return membership; // return membership
  }

  public async getById(_id: string): Promise<IMembership> {
    await this.validator.getById(_id);
    const membership: IMembership | null = await this.model.getById(_id);
    if (!membership) throw new NotFoundError('Membership not found!');

    return membership;
  }

  public async activate(_id: string): Promise<IMembership> {
    const memberStatus = MemberStatus.Active;

    const membership = await this.model.updateById(_id, {
      memberStatus,
      updatedAt: new Date()
    });
    if (!membership) throw new NotFoundError('Id membership not found!');
    if (membership.memberStatus !== memberStatus)
      throw new InvariantError('Failed activing membership!');
    return membership;
  }

  public async deactivate(_id: string): Promise<IMembership> {
    const memberStatus = MemberStatus.NotActive;
    const membership = await this.model.updateById(_id, {
      memberStatus,
      updatedAt: new Date()
    });
    if (!membership) throw new NotFoundError('Id membership not found!');
    if (membership.memberStatus !== memberStatus)
      throw new InvariantError('Failed deactiving membership!');
    return membership;
  }

  public async terminate(_id: string): Promise<IMembership> {
    const memberStatus = MemberStatus.Expired;
    const membership = await this.model.updateById(_id, {
      memberStatus,
      updatedAt: new Date()
    });
    if (!membership) throw new NotFoundError('Id membership not found!');
    if (membership.memberStatus !== memberStatus)
      throw new InvariantError('Failed terminate membership!');
    return membership;
  }
}
