import HTTPError from '../../../src/errors/http.error';
import subscriptionErrors from '../../../src/errors/subscription.errors';
import SubscriptionModel from '../../../src/models/subscription/subscription.model';
import ClubLogic from '../../../src/business-logic/club';
import checkClubExists from '../../../src/utils/check-club-exists.util';
import createSubscription from '../../../src/business-logic/subscription/create';

jest.mock('../../../src/utils/check-club-exists.util', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../src/business-logic/club', () => ({
  checkIfUserIsAdmin: jest.fn(),
}));

jest.mock('../../../src/models/subscription/subscription.model', () => ({
  create: jest.fn(),
}));

jest.mock('../../../src/errors/http.error');

describe('create', () => {
  it('should create a subscription if club exists and user is an admin', async () => {
    const args = {
      name: 'Subscription Name',
      price: '10.99',
      description: 'Subscription Description',
      clubId: 'clubId123',
      userId: 'adminUserId',
    };

    checkClubExists.mockResolvedValueOnce();

    ClubLogic.checkIfUserIsAdmin.mockResolvedValueOnce();

    const createdSubscription = {  };
    SubscriptionModel.create.mockResolvedValueOnce(createdSubscription);

    const result = await createSubscription(args);

    expect(checkClubExists).toHaveBeenCalledWith({
      clubId: args.clubId,
      errorObject: new HTTPError({ ...subscriptionErrors.clubNotFound, code: 404 }),
    });
    expect(ClubLogic.checkIfUserIsAdmin).toHaveBeenCalledWith({ clubId: args.clubId, userId: args.userId });
    expect(SubscriptionModel.create).toHaveBeenCalledWith(args);
    expect(result).toEqual(createdSubscription);
  });

  it('should throw an error if checkClubExists fails', async () => {
    const args = {
      name: 'Subscription Name',
      price: '10.99',
      description: 'Subscription Description',
      clubId: 'clubId123',
      userId: 'adminUserId',
    };

    const checkClubError = new HTTPError({ ...subscriptionErrors.clubNotFound, code: 404 });
    checkClubExists.mockRejectedValueOnce(checkClubError);

    await expect(createSubscription(args)).rejects.toThrow(checkClubError);
    expect(checkClubExists).toHaveBeenCalledWith({
      clubId: args.clubId,
      errorObject: new HTTPError({ ...subscriptionErrors.clubNotFound, code: 404 }),
    });
    expect(ClubLogic.checkIfUserIsAdmin).not.toHaveBeenCalled();
    expect(SubscriptionModel.create).not.toHaveBeenCalled();
  });

  it('should throw an error if ClubLogic.checkIfUserIsAdmin fails', async () => {
    const args = {
      name: 'Subscription Name',
      price: '10.99',
      description: 'Subscription Description',
      clubId: 'clubId123',
      userId: 'adminUserId',
    };

    checkClubExists.mockResolvedValueOnce();

    const checkAdminError = new Error('User is not an admin');
    ClubLogic.checkIfUserIsAdmin.mockRejectedValueOnce(checkAdminError);

    await expect(createSubscription(args)).rejects.toThrow(checkAdminError);
    expect(checkClubExists).toHaveBeenCalledWith({
      clubId: args.clubId,
      errorObject: new HTTPError({ ...subscriptionErrors.clubNotFound, code: 404 }),
    });
    expect(ClubLogic.checkIfUserIsAdmin).toHaveBeenCalledWith({ clubId: args.clubId, userId: args.userId });
    expect(SubscriptionModel.create).not.toHaveBeenCalled();
  });

  it('should throw an error if SubscriptionModel.create fails', async () => {
    const args = {
      name: 'Subscription Name',
      price: '10.99',
      description: 'Subscription Description',
      clubId: 'clubId123',
      userId: 'adminUserId',
    };

    checkClubExists.mockResolvedValueOnce();

    ClubLogic.checkIfUserIsAdmin.mockResolvedValueOnce();

    const createError = new Error('Error creating subscription');
    SubscriptionModel.create.mockRejectedValueOnce(createError);

    await expect(createSubscription(args)).rejects.toThrow(createError);
    expect(checkClubExists).toHaveBeenCalledWith({
      clubId: args.clubId,
      errorObject: new HTTPError({ ...subscriptionErrors.clubNotFound, code: 404 }),
    });
    expect(ClubLogic.checkIfUserIsAdmin).toHaveBeenCalledWith({ clubId: args.clubId, userId: args.userId });
    expect(SubscriptionModel.create).toHaveBeenCalledWith(args);
  });
});
