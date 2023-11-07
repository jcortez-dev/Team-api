import SubscriptionModel from '../../../src/models/subscription/subscription.model';
import ClubLogic from '../../../src/business-logic/club';
import listSubscriptionsByClub from '../../../src/business-logic/subscription/list-by-club';

jest.mock('../../../src/business-logic/club', () => ({
  checkIfUserIsAdmin: jest.fn(),
}));

jest.mock('../../../src/models/subscription/subscription.model', () => ({
  find: jest.fn(),
}));

describe('listByClub', () => {
  it('should return a list of subscriptions if user is an admin', async () => {
    const clubId = 'clubId123';
    const userId = 'adminUserId';

    ClubLogic.checkIfUserIsAdmin.mockResolvedValueOnce();

    const subscriptionsList = [{ }, { }];
    SubscriptionModel.find.mockResolvedValueOnce(subscriptionsList);

    const result = await listSubscriptionsByClub({ clubId, userId });

    expect(ClubLogic.checkIfUserIsAdmin).toHaveBeenCalledWith({ clubId, userId });
    expect(SubscriptionModel.find).toHaveBeenCalledWith({ clubId });
    expect(result).toEqual(subscriptionsList);
  });

  it('should throw an error if user is not an admin', async () => {
    const clubId = 'clubId123';
    const userId = 'nonAdminUserId';

    const checkAdminError = new Error('User is not an admin');
    ClubLogic.checkIfUserIsAdmin.mockRejectedValueOnce(checkAdminError);

    await expect(listSubscriptionsByClub({ clubId, userId })).rejects.toThrow(checkAdminError);

    expect(ClubLogic.checkIfUserIsAdmin).toHaveBeenCalledWith({ clubId, userId });
    expect(SubscriptionModel.find).not.toHaveBeenCalled();
  });

  it('should return an empty array if no subscriptions are found', async () => {
    const clubId = 'clubId123';
    const userId = 'adminUserId';

    ClubLogic.checkIfUserIsAdmin.mockResolvedValueOnce();

    SubscriptionModel.find.mockResolvedValueOnce([]);

    const result = await listSubscriptionsByClub({ clubId, userId });

    expect(ClubLogic.checkIfUserIsAdmin).toHaveBeenCalledWith({ clubId, userId });
    expect(SubscriptionModel.find).toHaveBeenCalledWith({ clubId });
    expect(result).toEqual([]);
  });
});
