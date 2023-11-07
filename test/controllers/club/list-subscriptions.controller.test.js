import SubscriptionLogic from '../../../src/business-logic/subscription';
import { returnErrorResponse } from '../../../src/errors/error-response';
import listSubscriptions from '../../../src/controllers/club/list-subscriptions.controller';

jest.mock('../../../src/business-logic/subscription', () => ({
  listByClub: jest.fn(),
}));

jest.mock('../../../src/errors/error-response', () => ({
  returnErrorResponse: jest.fn(),
}));

describe('listSubscriptions', () => {
  it('should return a list of subscriptions if SubscriptionLogic.listByClub is successful', async () => {
    const req = {
      userId: 'userId',
      params: { clubId: 'clubId' },
    };

    const subscriptionsList = [{ }, { }];
    SubscriptionLogic.listByClub.mockResolvedValueOnce(subscriptionsList);

    const res = {
      send: jest.fn(),
    };

    await listSubscriptions(req, res);

    expect(SubscriptionLogic.listByClub).toHaveBeenCalledWith({ clubId: req.params.clubId, userId: req.userId });
    expect(res.send).toHaveBeenCalledWith({ subscriptions: subscriptionsList });
    expect(returnErrorResponse.returnErrorResponse).not.toHaveBeenCalled();
  });

  it('should return an error response if SubscriptionLogic.listByClub fails', async () => {
    const req = {
      userId: 'userId',
      params: { clubId: 'clubId' },
    };

    const error = new Error('Error retrieving subscriptions');
    SubscriptionLogic.listByClub.mockRejectedValueOnce(error);

    const res = {
      send: jest.fn(),
    };

    await listSubscriptions(req, res);

    expect(SubscriptionLogic.listByClub).toHaveBeenCalledWith({ clubId: req.params.clubId, userId: req.userId });
    expect(returnErrorResponse.returnErrorResponse).toHaveBeenCalledWith({ error, res });
    expect(res.send).not.toHaveBeenCalled();
  });
});
